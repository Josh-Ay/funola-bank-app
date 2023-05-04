const { Schema, model } = require("mongoose");


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
        enum: ['NGN', 'USD']
    },
}, { timestamps: true });


// creating a new model using the above defined schema
const Wallet = model('wallet', walletSchema);

module.exports = {
    Wallet,
}