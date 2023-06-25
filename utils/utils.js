const { default: mongoose } = require("mongoose");

exports.validateMongooseId = (id) => {
    /**
     * Checks if a string is a valid mongo id.
     * 
     * @param id The string(possible mongo id) you would like to check.
     * 
     * @returns true | false
     */
    
    try {

        // creating a new mongo id
        let validId = new mongoose.Types.ObjectId(id);
        return true;
    
    } catch (error) {
        return false;
    }
}

// currencies accepted on the funola banking application
exports.funolaValidCurrencies = [
    'NGN',
    'USD',
]

exports.checkWalletRequestBodyErrors = (requestBody) => {
    /**
     * Validates the request body for the presence of amount and currency
     * 
     * @param requestBody The request body
     * 
     * @returns The request body or an object with 'errorMsg' key if any
     */

    // validating the request body for the keys
    const { amount, currency } = requestBody;
    if (!amount) return { errorMsg: "'amount' required" };
    if (!currency) return  { errorMsg: "'currency' required" };
    if (!this.funolaValidCurrencies.includes(currency)) return { errorMsg: `'currency' can only be one of ${this.funolaValidCurrencies.join(', ')}` };

    // validating amount passed is numeric
    if (isNaN(Number(amount))) return { errorMsg: "'amount' must be a number" };

    // validating the range of amount
    if (Number(amount) < 0.01) return { errorMsg: "'amount' must be greater than 0.01" };

    return { amount, currency };
}