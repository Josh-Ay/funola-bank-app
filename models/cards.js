const { Schema, model } = require("mongoose");
const { funolaValidCurrencies, funolaValidCardTypes, funolaValidCardPaymentNetworks } = require("../utils/utils");
const Joi = require("joi");

// creating a new schema
const cardSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    cardType: {
        type: String,
        required: true,
        enum: funolaValidCardTypes,
    },
    currency: {
        type: String,
        required: true,
        enum: funolaValidCurrencies,
    },
    balance: {
        type: Number,
        default: 0
    },
    cardName: {
        type: String,
    },
    paymentNetwork: {
        type: String,
        required: true,
        enum: funolaValidCardPaymentNetworks,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    cvv: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

function validateNewCardDetails (newCardDetails) {
    /**
     * Validates the heys and values for a new card object.
     * 
     * @param cardDetails
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        owner: Joi.required(),
        cardType: Joi.required().valid('virtual', 'physical'),
        currency: Joi.required().valid('NGN', 'USD'),
        balance: Joi.number(),
        cardName: Joi.string(),
        paymentNetwork: Joi.required().valid('Visa', 'Mastercard'),
    })

    return schema.validate(newCardDetails);
}


// creating a new model
const Card = model('card', cardSchema);

module.exports = {
    Card,
    validateNewCardDetails,
}