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
        name: Joi.string().min(1).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(6).required(),
        dateOfBirth: Joi.date().required(),
        country: Joi.string().required(),
        phoneNumber: Joi.string().required().min(10).max(13),
        phoneNumberExtension: Joi.string().required().min(1).max(4),
    })

    return schema.validate(userDetails);
}

function validateUserUpdateDetails(userDetails, typeOfUpdate) {
     /**
     * Validates the keys and values of an object scheduled for an update to a existing user.
     * 
     * @param userDetails The object you will like to validate.
     * @param typeOfUpdate The type of update you will like to perform.
     * 
     * @returns An object containing the validated value and error if any.
     */

    let schema;

    switch (typeOfUpdate) {
        case 'name':
            schema = Joi.object({
                name: Joi.string().min(1).required(),
            })
            break;
        case 'email':
            schema = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
            })
            break;
        default:
            schema = Joi.object({
                
            })
            break;
    }

    return schema.validate(userDetails);
}

// creating a new model
const User = model('user', userSchema);

module.exports = {
    User,
    validateNewUserDetails,
    validateUserUpdateDetails,
}