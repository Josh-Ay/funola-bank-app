const { funolaValidCurrencies, funolaUserTopupLimits } = require("../utils/utils");

exports.checkFundingLimit = (req, res, next) => {
    if (!req.user) return res.status(401).send('Access denied, token invalid or missing.')

    const { currency, amount } = req.body;

    // validating the request body and sending back appropriate error messages if any
    if (!amount) return res.status(400).send("'amount' required.");
    if (!currency) return res.status(400).send("'currency' required.");
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);
    
    if (currency === 'NGN') {
        // validating the amount is within the allowed limits
        if (amount > funolaUserTopupLimits.nairaLimit) return res.status(403).send(`'amount' must be less than ${funolaUserTopupLimits.nairaLimit} for NGN topups`);
        
        // validating the user has enough to process the fund request
        if (amount > req.user.dailyNairaTopupLimit) return res.status(403).send(`You have used ${Number(Number(funolaUserTopupLimits.nairaLimit) - Number(req.user.dailyNairaTopupLimit)).toFixed(2)} out of your daily limit of ${funolaUserTopupLimits.nairaLimit}. You can only fund ${req.user.dailyNairaTopupLimit} or less`);

        next();

        return
    }

    if (currency === 'USD') {
        // validating the amount is within the allowed limits
        if (amount > funolaUserTopupLimits.dollarLimit) return res.status(403).send(`'amount' must be less than ${funolaUserTopupLimits.dollarLimit} for USD topups`);
        
        // validating the user has enough to process the fund request
        if (amount > req.user.dailyDollarTopupLimit) return res.status(403).send(`You have used ${Number(Number(funolaUserTopupLimits.dollarLimit) - Number(req.user.dailyDollarTopupLimit)).toFixed(2)} out of your daily limit of ${funolaUserTopupLimits.dollarLimit}. You can only fund ${req.user.dailyDollarTopupLimit} or less`);

        next();

        return
    }

    res.status(500).send('An error occurred while trying to validate your funding request.')
}