const { Schema, model } = require("mongoose");
const Joi = require('joi');

// creating a new schema
const transactionSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['debit', 'credit', 'transfer', 'change'],
    },
    transactionRemarks: {
        type: String,
        required: true,
    },
    recipientInfo: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'success', 'failed'],
    },
    currency: {
        type: String,
        required: true,
        enum: ['NGN', 'USD'],
    },
    convertedAmountToReceive: {
        type: String,
    },
    cardId: {
        type: Schema.Types.Mixed,
    },
    walletId: {
        type: Schema.Types.Mixed,
        ref: 'wallet',
    },
}, { timestamps: true })


function validateNewTransactionDetails(transactionDetails) {
    /**
     * Validates the keys and values of a new transaction.
     * 
     * @param transactionDetails The new transaction you will like to validate.
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        owner: Joi.required(),
        transactionType: Joi.string().required().valid('debit', 'credit', 'transfer', 'change'),
        transactionRemarks: Joi.string().required().min(3),
        recipientInfo: Joi.string().required().min(3),
        amount: Joi.string().min(0.01).required(),
        status: Joi.string().required().valid('pending', 'success', 'failed'),
        currency: Joi.string().required().valid('NGN', 'USD'),
    })

    return schema.validate(transactionDetails);
}

function generateNewTransactionObj(userId, typeOfTransaction, remarks, infoOfRecipient, amount, status, currency) {
    return {
        owner: userId,
        transactionType: typeOfTransaction,
        transactionRemarks: remarks,
        recipientInfo: infoOfRecipient,
        amount: amount,
        status: status ? status : 'pending',
        currency: currency,
    }
}
// creating a new model using the schema defined above
const Transaction = model('transaction', transactionSchema);

module.exports = {
    Transaction,
    validateNewTransactionDetails,
    generateNewTransactionObj,
}
