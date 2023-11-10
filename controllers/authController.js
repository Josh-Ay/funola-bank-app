const { validateNewUserDetails, User } = require("../models/user");
const bcrypt = require('bcrypt');
const { sendSms } = require("../utils/smsUtil");
const path = require("path");
const { VerificationCodes } = require("../models/codes");
const { generateToken, validateToken } = require("../utils/tokenUtils");
const { compileHtml, sendEmail, validateEmail } = require("../utils/emailUtils");
const { Notification } = require("../models/notifications");

exports.send_verification_code = async (req, res) => {
    // checking for a request body
    if (!req.body) return res.status(400).send('Request body cannot be empty');

    // validating the request body
    const { number, email } = req.body;
    if (!number) return res.status(400).send("'number' is required");
    if (number.length < 10 || number.length > 15) return res.status(400).send("Please provide a valid number");
    if (!email) return res.status(400).send("'email' is required");
    if (!validateEmail(email)) return res.status(400).send("'email' must be a valid email");

    const emailRegistered = await User.findOne({ email: email });
    if (emailRegistered) return res.status(409).send("Email already registered");

    const verificationCode = Math.floor(Math.random() * 9000 + 1000);
    const verificationHtml = compileHtml(`${number}`, 'Verify your number', verificationCode, 'verifyNumber');

    await Promise.all([
        // sending an sms containing the code to the user
        await sendSms(number, `Please use this CODE to verify your account: ${verificationCode}.\n\nIt expires in 5 minutes`),

        // also sending an email containing the code
        await sendEmail(email, 'Verify your number on Funola', verificationHtml),

        // creating a new verification code
        await VerificationCodes.create({
            code: verificationCode,
            codeExpiresAt: new Date(new Date().getTime() + 300000),
            number: number,
        })
    ])

    return res.status(200).send(`Successfully sent verification code to ${number} and ${email}.`);
}

exports.verify_code = async (req, res) => {
    const { code, number } = req.body;

    // validating the request body and sending back an appropriate error message if any
    if (!code) return res.status(400).send("'code' required");
    if (!number) return res.status(400).send("'number' required");

    // checking for a stored non-expired code that matches the code sent
    const validCode = await VerificationCodes.findOne({ code: code, codeExpiresAt: { '$gt': new Date() }, number: number });
    if (!validCode) return res.status(404).send("Code expired or not found");
    if (validCode.used) return res.status(409).send("Code already used. Kindly request a new one.");

    // updating the code's status to signify that it has been used
    validCode.used = true;
    await validCode.save();

    return res.status(200).send('Successfully verified code');
}

exports.register_user = async (req, res) => {
    // checking for a request body
    if (!req.body) return res.status(400).send('Request body cannot be empty');

    // validating the request body and sending back an appropriate error message if any
    const validUserDetails = validateNewUserDetails(req.body);
    if (validUserDetails.error) return res.status(400).send(validUserDetails.error.details[0].message);

    // validating the phone number and extension passed
    if (isNaN(Number(validUserDetails.value.phoneNumber))) return res.status(400).send("'phoneNumber' must be a number");
    if (isNaN(Number(validUserDetails.value.phoneNumberExtension))) return res.status(400).send("'phoneNumberExtension' must be a number");

    // checking if there is an existing user
    const existingUser = await User.findOne({ email: validUserDetails.value.email });
    if (existingUser) return res.status(409).send('Email already registered. Login instead');

    // creating a new user using the model defined
    const newUser = new User({ ...validUserDetails.value });

    // hashing and salting the user's password
    const hashAndSaltedPassword = await bcrypt.hash(validUserDetails.value.password, Number(process.env.SALT_ROUNDS));
    newUser.password = hashAndSaltedPassword;

    // creating a copy of the valid details entered by the user
    const copyOfValidUserDetails = {...validUserDetails.value};
    delete copyOfValidUserDetails.password;

    // creating a verification token for the new user
    const { token: verificationToken } = await generateToken(copyOfValidUserDetails, 'verification');
    newUser.verificationToken = verificationToken;

    // compiling the verification html mail to send to the new user
    const linkToVerifyAccount = `${process.env.SERVER_URL}/auth/verify?token=${verificationToken}`;
    const verificationHtml = compileHtml(`${newUser.firstName} ${newUser.lastName}`, 'Welcome to Funola!', linkToVerifyAccount, 'verificationMail');
    const mailResponse = await sendEmail(newUser.email, 'Verify your account on Funola', verificationHtml);

    // if an error occured trying to send the email
    if (mailResponse.error) return res.status(500).send(`Verification mail failed to send to: ${newUser.email}`);
    
    // saving the new user
    await newUser.save();

    return res.status(201).send('Sucessfully registed new account!');
}

exports.verify_new_account = async (req, res) => {
    const { token } = req.query;

    // checking for a 'token' request query param
    if (!token) return res.status(401).send("'token' required");

    const validToken = validateToken(token, 'verification');
    if (!validToken) return res.status(401).send('Invalid token provided');
    
    const existingUser = await User.findOne({ email: validToken.email });
        
    // validating the user exists and the account is not yet verified
    if (!existingUser) return res.status(404).send('User not found');
    if (existingUser.accountVerified) return res.status(409).send('Account already verified.')

    // updating the existing user details
    existingUser.accountVerified = true;
    existingUser.verificationToken = null;

    await existingUser.save();

    // notifying the user of successful account verification
    await Notification.create({
        owner: existingUser._id,
        content: 'You have successfully verified your account on Funola!',
    })

    return res.status(200).send('Successfully verified account!');
}

exports.login_user = async (req, res) => {
    const { email, password } = req.body;
    
    // validating the request body
    if (!email) return res.status(400).send("'email' required");
    if (!password) return res.status(400).send("'password' required");

    // checking if there is an existing user
    const existingUser = await User.findOne({ email: email }).lean();
    if (!existingUser) return res.status(401).send('Invalid email or password');

    // checking the password passed matches the password saved in db
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) return res.status(401).send('Invalid email or password');

    // if the user has not yet verified account
    if (!existingUser.accountVerified) return res.status(202).send('Please check your email to verify your account');

    // creating a copy of the existing user object
    const copyOfExistingUser = {...existingUser};
    delete copyOfExistingUser.password;
    delete copyOfExistingUser.refreshToken;
    delete copyOfExistingUser.verificationToken;
    delete copyOfExistingUser.transactionPin;

    // creating new access and refresh tokens for the user
    const { token: accessToken, expirationTime: accessTokenExpires } = await generateToken(copyOfExistingUser, 'access');
    const { token: refreshToken, expirationTime: refreshTokenExpires } = await generateToken(copyOfExistingUser, 'refresh');

    await User.findByIdAndUpdate(existingUser._id, { $set: { refreshToken: refreshToken } });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: accessTokenExpires,
        signed: true,
        // secure: true,
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpires,
        signed: true,
        // secure: true,
    })
    
    res.status(200).send("Successfully logged in");
}

exports.request_password_reset = async (req, res) => {
    const { email } = req.body;
    
    // validating the request body
    if (!email) return res.status(400).send("'email' required");

    // checking if there is an existing user with the email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        const { token: resetPasswordToken } = await generateToken({email: existingUser.email, firstName: existingUser.firstName, lastName: existingUser.lastName, _id: existingUser._id}, 'reset');
        
        existingUser.resetPasswordToken = resetPasswordToken;

        // compiling the password reset mail to send to the new user
        const linkToResetPassword = `${process.env.SERVER_URL}/auth/reset-password?token=${resetPasswordToken}`;
        const resetHtml = compileHtml(`${existingUser.firstName} ${existingUser.lastName}`, 'Reset password', linkToResetPassword, 'resetPasswordMail');
        const mailResponse = await sendEmail(existingUser.email, 'Funola Password Reset', resetHtml);

        // if an error occured trying to send the email
        if (mailResponse.error) return res.status(500).send(`Reset password mail failed to send to: ${existingUser.email}`);

        await existingUser.save();
    }
    
    return res.status(200).send('An email to reset password will be sent to the email provided if an account exists on our platform.');
}

exports.reset_user_password = async (req, res) => {

    const { token } = req.query;
    const { email, password } = req.body;


    if (req.method === 'PUT') {
        // checking for a 'token' request query param
        if (!token) return res.status(401).send({ message: "'token' required" });
            
        // validating the jwt token passed against the token secret
        const validToken = validateToken(token, 'reset');
        if (!validToken) return res.status(401).json({ message: 'Invalid token provided' });

        // validating the request body
        if (!email) return res.status(400).json({ message: "'email' required" });
        if (!password) return res.status(400).json({ message: "'password' required" });
    
        // checking if there is an existing user
        const existingUser = await User.findOne({ email: email, resetPasswordToken: token });
        if (!existingUser) return res.status(404).json({ message: 'User not found or link has already been used' });

        // hashing and salting the user's new password
        const hashAndSaltedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        existingUser.password = hashAndSaltedPassword;
        existingUser.resetPasswordToken = null;

        await existingUser.save();

        // compiling the password change mail to send to the new user
        const passwordChangeHtml = compileHtml(`${existingUser.firstName} ${existingUser.lastName}`, 'Password changed', '', 'passwordChange');
        await sendEmail(existingUser.email, 'Funola Password Change', passwordChangeHtml);

        return res.status(200).json({ message: 'Successfully changed your password!' });
    }

    // checking for a 'token' request query param
    if (!token) return res.status(401).send("'token' required");

    // validating the jwt token passed against the token secret
    const validToken = validateToken(token, 'reset');
    if (!validToken) return res.status(401).json('Invalid token provided');

    // checking if the user exists
    const existingUser = await User.findOne({ email: validToken.email, resetPasswordToken: token  });
    
    // validating the user exists and the account is not yet verified
    if (!existingUser) return res.status(404).send('User not found or link has already been used');
    
    // sending back the html file to allow the user reset password
    res.sendFile(path.join(__dirname, '..', 'views', 'resetPassword.html'));
}

exports.change_user_password = async (req, res) => {
    const { email, previousPassword, password } = req.body;
    
    // checking there is a logged-in user
    if (!req.user) return res.status(401).send('Access denied');

    // validating the request body
    if (!email) return res.status(400).send("'email' required");
    if (!password) return res.status(400).send("'password' required");
    if (!previousPassword) return res.status(400).send("'previousPassword' required");

    if (password === previousPassword) return res.status(400).send("You cannot use your previous password as your new password");
    if (req.user.email !== email) return res.status(401).send('You can only make updates to your account.');

    // checking if there is an existing user
    const existingUser = await User.findOne({ _id: req.user._id, email: email });
    if (!existingUser) return res.status(404).send('User not found');

    // checking that the user has verified account
    if (!existingUser.accountVerified) return res.status(401).send('Kindly verify your account first');

    // checking the previous password passed matches the password saved in db
    const passwordMatch = await bcrypt.compare(previousPassword, existingUser.password);
    if (!passwordMatch) return res.status(401).send('Previous password mismatch');

    // hashing and salting the user's new password
    const hashAndSaltedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    existingUser.password = hashAndSaltedPassword;

    await existingUser.save();

    // compiling the password change mail to send to the new user
    const passwordChangeHtml = compileHtml(`${existingUser.firstName} ${existingUser.lastName}`, 'Password changed', '', 'passwordChange');
    await sendEmail(existingUser.email, 'Funola Password Change', passwordChangeHtml);

    return res.status(200).send('Successfully changed your password!')
}

exports.refresh_user_token = async (req, res) => {
    // validating the request body
    const { token } = req.body;
    if (!token) return res.status(400).send("'token' required");

    // checking that it is a valid refresh token
    const validRefreshToken = validateToken(token, 'refresh');
    if (!validRefreshToken) return res.status(401).send("Invalid token provided");

    // checking the decoded refresh token matches an existing user
    const existingUser = await User.findOne({ _id: validRefreshToken._id, refreshToken: token }).select('-password -refreshToken').lean();
    if (!existingUser) return res.status(401).send("Token has been used by user");

    // checking that the user has verified account
    if (!existingUser.accountVerified) return res.status(401).send('Kindly verify your account first');

    // creating a copy of the existing user object
    const copyOfExistingUser = {...existingUser};
    delete copyOfExistingUser.password;
    delete copyOfExistingUser.refreshToken;
    delete copyOfExistingUser.verificationToken;
    delete copyOfExistingUser.transactionPin;
    
    // creating new access and refresh tokens for the user
    const { token: accessToken, expirationTime: accessTokenExpires } = await generateToken(copyOfExistingUser, 'access');
    const { token: refreshToken, expirationTime: refreshTokenExpires } = await generateToken(copyOfExistingUser, 'refresh');

    await User.findByIdAndUpdate(existingUser._id, { $set: { refreshToken: refreshToken } });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: accessTokenExpires,
        signed: true,
        // secure: true,
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenExpires,
        signed: true,
        // secure: true,
    })

    res.status(200).send("Successfully refreshed token!");
}

exports.get_login_status = async (req, res) =>  res.status(200).send(`${req.user.firstName} ${req.user.lastName} still has access`);

exports.logout_user = (req, res) => {
    // console.log(req.user);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).send("Successfully logged out");
}

exports.delete_account = async (req, res) => {
    return res.status(200).send("Still in development")
}