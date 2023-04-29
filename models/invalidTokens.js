const { Schema, model } = require("mongoose");

// creating a new schema
const invalidTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
})

// creating a new model using the above schema
const InvalidTokens = model('invalid-token', invalidTokenSchema);

module.exports = {
    InvalidTokens,
}