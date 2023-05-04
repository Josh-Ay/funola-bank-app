const { Schema, model } = require("mongoose");
const Joi = require('joi');

// creating a new schema
const depositSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
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
        enum: ['NGN', 'USD'],
    },
    paybackAmount: {
        type: Number,
        required: true,
    },
});

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
        duration: Joi.required().min(1),
        rate: Joi.required().min(1),
        paybackDate: Joi.date().required(),
        currency: Joi.string().required().valid('NGN', 'USD'),
        paybackAmount: Joi.required().min(0.01),
    })

    return schema.validate(depositDetails);
}


// creating a new model using the schema defined above
const Deposit = model('deposit', depositSchema);


module.exports = {
    Deposit,
    validateNewDepositDetails,
}