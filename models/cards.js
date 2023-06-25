const { Schema, model } = require("mongoose");
const { funolaValidCurrencies, funolaValidCardTypes } = require("../utils/utils");

// creating a new schema
const cardSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    cardId: {
        type: String,
        required: true, 
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
    }
}, { timestamps: true })

// creating a new model
const Card = model('card', cardSchema);

module.exports = {
    Card,
}