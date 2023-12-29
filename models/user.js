const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { funolaUserTopupLimits } = require("../utils/utils");

// defining a schema for the user
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
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
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F'],
    },
    dollarVirtualCardId: {
        type: String,
    },
    nairaVirtualCardId: {
        type: String,
    },
    transactionPin: {
        type: String,
    },
    loginPin: {
        type: String,
    },
    adminUser: {
        type: Boolean,
    },
    hideAccountBalances: {
        type: Boolean,
        default: false,
    },
    dailyNairaTopupLimit: {
        type: Number,
        default: funolaUserTopupLimits.nairaLimit,
    },
    dailyDollarTopupLimit: {
        type: Number,
        default: funolaUserTopupLimits.dollarLimit,
    },
}, { timestamps: true })

function validateNewUserDetails(userDetails) {
    /**
     * Validates the keys and values of a new user object.
     * 
     * @param userDetails The user object you will like to validate.
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(6).required(),
        dateOfBirth: Joi.date().required(),
        country: Joi.string().required(),
        phoneNumber: Joi.string().required().min(10).max(13),
        phoneNumberExtension: Joi.string().required().min(1).max(4),
        title: Joi.string().required().valid('Mr', 'Miss', 'Mrs'),
        gender: Joi.string().required().valid('M', 'F'),
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
                firstName: Joi.string().min(2).required(),
                lastName: Joi.string().min(2).required(),
            })
            break;
        case 'email':
            schema = Joi.object({
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
            })
            break;
        case 'profilePhoto':
            schema = Joi.object({
                profilePhoto: Joi.string().required(),
            })
            break;
        case 'pin':
            schema = Joi.object({
                transactionPin: Joi.required(),
            })
            break;
        case 'balanceVisibility':
            schema = Joi.object({
                hideAccountBalances: Joi.boolean().required(),
            })
            break;
        case 'login-pin':
            schema = Joi.object({
                loginPin: Joi.required(),
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