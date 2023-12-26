const Joi = require("joi");
const { Schema, model } = require("mongoose");

// defining a new schema for recent mobile transfers
const recentMobileTransferSchema = new Schema({
    owner: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    userId: {
        type: Schema.Types.Mixed,
        required: true,
        ref: 'user',
    },
    userPhoneNumber: {
        type: String,
        required: true,
    },
    userPhoneNumberExtension: {
        type: String,
        required: true,
    },
}, { timestamps: true })


function validateRecentMobileTransfer(recentEntry) {
    /**
     * Validates the keys and values of a new recent mobile transfer object.
     * 
     * @param recentEntry The user object you will like to validate.
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        owner: Joi.string().required(),
        userId: Joi.string().required(),
        userPhoneNumber: Joi.string().required().min(10).max(13),
        userPhoneNumberExtension: Joi.string().required().min(1).max(4),
    })

    return schema.validate(recentEntry)
}


// creating a model using the schema defined above
const RecentMobileTransfer = model('recent-user-mobile-transfer', recentMobileTransferSchema);


module.exports = {
    RecentMobileTransfer,
    validateRecentMobileTransfer,
}