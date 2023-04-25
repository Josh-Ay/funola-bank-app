const Joi = require("joi");
const { Schema, model } = require("mongoose");

// defining a schema for the user
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    phoneNumberExtension: {
        type: String,
        required: true,
    },
    accountVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
})

function validateNewUserDetails(userDetails) {
    /**
     * Validates the keys and values of a new user object.
     * 
     * @param userDetails The user object you will like to validate.
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(6).required(),
        dateOfBirth: Joi.date().required(),
        country: Joi.string().required(),
        phoneNumber: Joi.string().required().min(10).max(13),
        phoneNumberExtension: Joi.string().required().min(1).max(4),
    })

    return schema.validate(userDetails);
}

// creating a new model
const User = model('user', userSchema);

module.exports = {
    User,
    validateNewUserDetails,
}