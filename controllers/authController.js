const { validateNewUserDetails, User } = require("../models/user");
const bcrypt = require('bcrypt');
const { sendEmail, sendSms, compileHtml, generateToken, validateToken } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const path = require("path");
const { VerificationCodes } = require("../models/codes");

exports.send_verification_code = async (req, res) => {
    // checking for a request body
    if (!req.body) return res.status(400).send('Request body cannot be empty');

    // validating the request body
    if (!req.body.number) return res.status(400).send("'number' is required");

    const [ number , verificationCode ] = [ req.body.number, Math.floor(Math.random() * 8328) ];

    // sending an sms containing the code to the user
    await sendSms(number, `Please use this CODE to verify your account: ${verificationCode}.\n\nIt expires in 5 minutes`);

    // creating a new verification code
    await VerificationCodes.create({
        code: verificationCode,
        codeExpiresAt: new Date(new Date().getTime() + 300000) 
    })

    return res.status(200).send(`Successfully sent verification code to ${number}`);
}

exports.verify_code = async (req, res) => {
    const { code } = req.body;

    // validating the request body and sending back an appropriate error message if any
    if (!code) return res.status(400).send("'code' required");

    // checking for a stored non-expired code that matches the code sent
    const validCode = await VerificationCodes.findOne({ code: code, codeExpiresAt: { '$gt': new Date() } });
    if (!validCode) return res.status(404).send("code expired or not found");

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

    // creating a verification token for the new user
    const verificationToken = await generateToken(validUserDetails.value, 'verification');
    newUser.verificationToken = verificationToken;

    // compiling the verification mail to send to the new user
    const linkToVerifyAccount = `${process.env.SERVER_URL}/auth/verify?token=${verificationToken}`;
    const verificationHtml = compileHtml('Welcome to Yoola!', linkToVerifyAccount, 'verificationMail');
    const mailResponse = await sendEmail(newUser.email, 'Verify your account on Yoola', verificationHtml);

    // if an error occured trying to send the email
    if (mailResponse.error) return res.status(500).send(`Verification mail failed to send to: ${newUser.email}`);
    
    // saving the new user
    await newUser.save();

    return res.status(200).send('Sucessfully registed new account!');
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

    // creating new access and refresh tokens for the user
    const accessToken = await generateToken(existingUser, 'access');
    const refreshToken = await generateToken(existingUser, 'refresh');

    res.status(200)
    .set('access-token', accessToken)
    .set('refresh-token', refreshToken)
    .set("Access-Control-Expose-Headers", "access-token, refresh-token")
    .json({ accessToken })
}

exports.request_password_reset = async (req, res) => {
    const { email } = req.body;
    
    // validating the request body
    if (!email) return res.status(400).send("'email' required");

    // checking if there is an existing user with the email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        const resetPasswordToken = await generateToken({email: existingUser.email, name: existingUser.name, _id: existingUser._id}, 'reset');
        
        existingUser.resetPasswordToken = resetPasswordToken;

        // compiling the password reset mail to send to the new user
        const linkToResetPassword = `${process.env.SERVER_URL}/auth/reset-password?token=${resetPasswordToken}`;
        const resetHtml = compileHtml('Reset password', linkToResetPassword, 'resetPasswordMail');
        const mailResponse = await sendEmail(existingUser.email, 'Yoola Password Reset', resetHtml);

        // if an error occured trying to send the email
        if (mailResponse.error) return res.status(500).send(`Reset password mail failed to send to: ${existingUser.email}`);

        await existingUser.save();
    }
    
    return res.status(200).send('An email to reset password will be sent to the email provided if an accounts exists on our platform.');
}

exports.reset_user_password = async (req, res) => {

    const { token } = req.query;
    const { email, password } = req.body;


    if (req.method === 'POST') {
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
        const passwordChangeHtml = compileHtml('Password changed', '', 'passwordChange');
        await sendEmail(existingUser.email, 'Yoola Password Change', passwordChangeHtml);

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

    if (req.user.email !== email) return res.status(401).send('You can only make updates to your account.');

    // checking if there is an existing user
    const existingUser = await User.findOne({ _id: req.user._id, email: email });
    if (!existingUser) return res.status(404).send('User not found');

    // checking the previous assword passed matches the password saved in db
    const passwordMatch = await bcrypt.compare(previousPassword, existingUser.password);
    if (!passwordMatch) return res.status(401).send('Password mismatch');

    // hashing and salting the user's new password
    const hashAndSaltedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
    existingUser.password = hashAndSaltedPassword;

    await existingUser.save();

    // compiling the password change mail to send to the new user
    const passwordChangeHtml = compileHtml('Password changed', '', 'passwordChange');
    await sendEmail(existingUser.email, 'Yoola Password Change', passwordChangeHtml);

    return res.status(200).send('Successfully changed your password!')
}
