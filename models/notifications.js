const { Schema, model } = require("mongoose");

// creating a new schema
const notificationSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    content: {
        type: String,
        required: true,
    },
    transactionId: {
        type: Schema.Types.Mixed,
        ref: 'transaction',
    },
    read: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


// creating a new model based on the schema defined above
const Notification = model('notification', notificationSchema);

module.exports = {
    Notification,
}