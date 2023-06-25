const { Schema, model } = require("mongoose");
const Joi = require('joi');
const { funolaValidCurrencies } = require("../utils/utils");

// creating a new schema
const depositSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    depositAmount: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    paybackDate: {
        type: Date,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        enum: funolaValidCurrencies,
    },
    paybackAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'wallet'],
    },
}, { timestamps: true });

function validateNewDepositDetails(depositDetails) {
    /**
     * Validates the keys and values of a new deposit.
     * 
     * @param depositDetails The new deposit you will like to validate.
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        owner: Joi.required(),
        duration: Joi.required(),
        rate: Joi.required(),
        currency: Joi.string().required().valid('NGN', 'USD'),
        depositAmount: Joi.required(),
        paymentMethod: Joi.string().required().valid('card', 'wallet'),
    })

    return schema.validate(depositDetails);
}


// creating a new model using the schema defined above
const Deposit = model('deposit', depositSchema);


module.exports = {
    Deposit,
    validateNewDepositDetails,
}