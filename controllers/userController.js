const { InvalidTokens } = require("../models/invalidTokens");
const { Notification } = require("../models/notifications");
const { User, validateUserUpdateDetails } = require("../models/user");
const { compileHtml, sendEmail } = require("../utils/emailUtils");
const bcrypt = require('bcrypt');
const { funolaUserTopupLimits } = require("../utils/utils");

exports.get_user_profile = async (req, res) => {
    // sending back the user's details
    return res.status(200).send(req.user);
}

exports.update_user_detail = async (req, res) => {
    // validating the request parameters
    const { updateType } = req.params;
    if (!updateType) return res.status(400).send("'updateType' required");

    // fetching the user details
    const foundUser = await User.findById(req.user._id).select('-password -refreshToken');

    // validating the request body and sending back an appropriate error message if any
    const validUserDetails = validateUserUpdateDetails(req.body, updateType);
    if (validUserDetails.error) return res.status(400).send(validUserDetails.error.details[0].message);
    
    switch (updateType) {
        // updating the user's name
        case 'name':

            // updating the user's name in db
            foundUser.firstName = validUserDetails.value.firstName;
            foundUser.lastName = validUserDetails.value.lastName;
            await foundUser.save();

            return res.status(200).send("Name successfully updated!");
        
        // updating the user's email
        case 'email':

            // fetching the authentication token used
            const authToken = req.signedCookies['accessToken'];

            // validating the user wants to make changes to their account
            if (foundUser.email !== req.user.email) return res.status(401).send("You can only update your email");

            // checking that no other user has the new mail
            const existingUserWithEmail = await User.findOne({ email: validUserDetails.value.email });
            if (existingUserWithEmail) return res.status(409).send("New email already registered");

            // compiling and sending a mail to the user to inform of the email change
            const emailChangeHtml = compileHtml(`${foundUser.firstName} ${foundUser.lastName}`, 'Email Changed on Funola!', validUserDetails.value.email, 'emailChange');
            await sendEmail(foundUser.email, 'Email Change on Funola', emailChangeHtml);

            // invalidating the authentication token used
            await InvalidTokens.create({
                token: authToken,
            });
            
            // updating the user's email in the db
            foundUser.email = validUserDetails.value.email;
            await foundUser.save();

            return res.status(200).send("Email successfully updated! You will have to login again with the new email set.");
        
        // updating the user's profile photo
        case 'profilePhoto':
            return res.status(200).send("Still in development");
        
        // updating the user's transaction pin
        case 'pin':
            // validating transactionPin passed is numeric
            if (isNaN(Number(validUserDetails.value.transactionPin))) return res.status(400).send("'transactionPin' must be a number");
            if (String(validUserDetails.value.transactionPin).length !== 6) return res.status(400).send("Please enter a 6-digit number")
            
            // hashing and salting the pin
            const hashAndSaltedPin = await bcrypt.hash(String(validUserDetails.value.transactionPin), Number(process.env.SALT_ROUNDS));
            foundUser.transactionPin = hashAndSaltedPin;
            await foundUser.save();

            return res.status(200).send("Pin successfully updated");
        
        // updating the visibility of account balance for the user
        case 'balanceVisibility':
            
            // updating the value in the db
            foundUser.hideAccountBalances = validUserDetails.value.hideAccountBalances;
            await foundUser.save();

            return res.status(200).send("Successfully updated balance visibility");
        default:
            return res.status(400).send("Invalid update type passed");
    }
}

exports.get_user_notifications = async (req, res) => {
    const { end } = req.body;

    if (end) {
        // validating 'end' passed is numeric
        if (isNaN(Number(end))) return res.status(400).send("'end' must be a number");

        // validating the 'end' is positive
        if (Number(end) < 0) return res.status(400).send("'end' must be a positive number");
    }

    // fetching the a specific number or the first 50 notifications for the user
    const notifications = await Notification.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(end ? end : 50).lean();
    // console.log(notifications);

    const updatedNotifications = await Promise.all(notifications.map(async (notification) => {
        // updating notifications that have the id of the user included in them
        if (notification.content.includes('#') && notification.content.includes('!#')) {
            // getting the start and end index of the location the user id in the notification content
            const [startIndex, endIndex] =  [notification.content.indexOf('#'), notification.content.lastIndexOf('#')];
            if (startIndex === -1 || endIndex === -1) return null;

            const [subStrToReplace, userIdToGet] = [notification.content.substring(startIndex, endIndex + 1), notification.content.substring(startIndex + 1, endIndex - 1)];

            // getting the user details
            const foundUser = await User.findById(userIdToGet).lean().select('firstName lastName');
            if (!foundUser) return null
            
            // updating the notification content with the user details
            notification.content = notification.content.replace(subStrToReplace, `${foundUser.firstName} ${foundUser.lastName}`);
            return notification
        }
        return notification
    }).filter(notification => notification))
    // console.log(updatedNotifications);

    return res.status(200).send(updatedNotifications);
}

exports.get_other_users = async (req, res) => {
    // fetching the first 100 users
    const users = await User.find({ }).limit(100).select('_id firstName lastName phoneNumber phoneNumberExtension').lean();
    
    return res.status(200).send(users);
}

exports.fundLimitReset = async (req, res) => {
    try {
        // Resets the funding/topup limit for all users
        await User.updateMany(
            {}, 
            {
                $set: { 
                    dailyNairaTopupLimit: funolaUserTopupLimits.nairaLimit, 
                    dailyDollarTopupLimit: funolaUserTopupLimits.dollarLimit
                }
            }
        )
        return res.status(200).send('Successfully reset the topup limits for all users');
        
    } catch (error) {
        console.log('Failed to reset topup limits for users: ', error);
        return res.status(500).send('Failed to reset topup limits for users: ');
    }
}