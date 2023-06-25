const { Schema, model } = require("mongoose");
const { funolaValidCurrencies } = require("../utils/utils");


// creating a new schema
const walletSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    balance: {
        type: Number,
        default: 0,
    },
    unclearedBalance: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        required: true,
        enum: funolaValidCurrencies,
    },
}, { timestamps: true });


// creating a new model using the above defined schema
const Wallet = model('wallet', walletSchema);

module.exports = {
    Wallet,
}