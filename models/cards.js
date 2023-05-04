const { Schema, model } = require("mongoose");

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
        enum: ['NGN', 'USD'],
    },
}, { timestamps: true })

// creating a new model
const Card = model('card', cardSchema);

module.exports = {
    Card,
}