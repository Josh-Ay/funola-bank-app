const { InvalidTokens } = require("../models/invalidTokens");
const { Notification } = require("../models/notifications");
const { User, validateUserUpdateDetails } = require("../models/user");
const { compileHtml, sendEmail } = require("../utils/emailUtils");

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
            const authToken = req.headers['auth-token'];

            // validating the user wants to make changes to their account
            if (foundUser.email !== req.user.email) return res.status(401).send("You can only update your email");

            // checking that no other user has the new mail
            const existingUserWithEmail = await User.findOne({ email: validUserDetails.value.email });
            if (existingUserWithEmail) return res.status(409).send("New email already registered");

            // compiling and sending a mail to the user to inform of the email change
            const emailChangeHtml = compileHtml(`${foundUser.firstName} ${foundUser.lastName}`, 'Email Changed on Yoola!', validUserDetails.value.email, 'emailChange');
            await sendEmail(foundUser.email, 'Email Change on Yoola', emailChangeHtml);

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
        default:
            return res.status(400).send("Invalid update type passed");
    }
}

exports.get_user_notifications = async (req, res) => {

    // finding all the notifications for the user
    const notifications = await Notification.find({ owner: req.user._id }).lean();
    // console.log(notifications);

    return res.status(200).send(notifications);
}