const Joi = require("joi");
const { Schema, model } = require("mongoose");

// creating a new schema
const atmSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    distance: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

const validateNewATM = (newAtmDetails) => {
    /**
     * Validates the keys and values for a new ATM entry.
     * 
     * @param newAtmDetails
     * 
     * @returns An object containing the validated value and error if any.
     */

    const schema = Joi.object({
        name: Joi.string().required().min(3),
        distance: Joi.number().required(),
    })

    return schema.validate(newAtmDetails);
}


// creating a new model
const ATM = model('atm', atmSchema);

module.exports = {
    ATM,
    validateNewATM,
}