const { Schema, model } = require("mongoose");

// creating a new schema for verification codes
const verificationCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    codeExpiresAt: {
        type: Date,
        required: true,
    }
})

// creating a new model
const VerificationCodes = model('verification-code', verificationCodeSchema);

module.exports = {
    VerificationCodes,
}