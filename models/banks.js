const { Schema, model } = require("mongoose");
const { funolaValidBankAccountTypes } = require("../utils/utils");
const Joi = require("joi");

const bankSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    type: {
        type: String,
        required: true,
        minLength: 3,
        enum: funolaValidBankAccountTypes,
    },
    accountNumber: {
        type: String,
        required: true,
        minLength: 9,
        maxLength: 10,
    },
}, { timestamps: true })

function validateBankDetails(bankDetail, newEntry=true) {
    /**
     * Validates the keys and values for a new bank entry.
     * 
     * @param bankDetail
     * 
     * 
     * @returns An object containing the validated value and error if any.
     * 
     */

    const schema = newEntry ? Joi.object({
        owner: Joi.required(),
        name: Joi.string().required().min(3),
        type: Joi.string().required().min(3).valid('Personal', 'Savings'),
        accountNumber: Joi.string().required().length(10),
    }) 
    :

    Joi.object({
        name: Joi.string().required().min(3),
        type: Joi.string().required().min(3).valid('Personal', 'Savings'),
        accountNumber: Joi.string().required().length(10),
    })

    return schema.validate(bankDetail);
}

// creating a new bank model using the schema defined above
const Bank = model('bank', bankSchema);


module.exports = {
    Bank,
    validateBankDetails,
}