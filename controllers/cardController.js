const { Card, validateNewCardDetails, validCardSettingsUpdate } = require('../models/cards');
const { funolaValidCurrencies, funolaValidCardTypes, funolaValidCardPaymentNetworks } = require('../utils/utils');
const { generateNewTransactionObj, validateNewTransactionDetails, Transaction } = require("../models/transaction");
const { Notification } = require("../models/notifications");
const { compileHtml, sendEmail } = require("../utils/emailUtils");

exports.create_new_card = async (req, res) => {
    // validating request parameters and sending back appropriate error messages if any
    const { cardType } = req.params;
    if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);

    if (cardType === 'physical') return res.status(202).send("Feature still in development");

    // validating request body and sending back appropriate error messages if any
    const { currency, cardName, paymentNetwork } = req.body;
    if (!currency) return res.status(400).send("'currency' required");
    if (!paymentNetwork) return res.status(400).send("'paymentNetwork' required");
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);
    if (!funolaValidCardPaymentNetworks.includes(paymentNetwork)) return res.status(400).send(`'paymentNetwork' can only be one of ${funolaValidCardPaymentNetworks.join(', ')}`);

    // checking if the user's account has not yet been verified
    if (!req.user.accountVerified) return res.status(401).send('Kindly verify your account first');
    
    // checking if the user already has requested virtual card with the passed 'currency'
    const userHasCard = await Card.findOne({ owner: req.user._id, currency: currency });
    if (userHasCard) return res.status(409).send(`${currency} ${cardType} card creation failed because user already has one`);

    // validating the new card details
    const validNewCardDetails = validateNewCardDetails({
        owner: req.user._id,
        cardType: cardType,
        currency: currency,
        balance: 0,
        cardName: cardName ? cardName : `${req.user.firstName} ${req.user.lastName}`,
        paymentNetwork: paymentNetwork,
    })
    if (validNewCardDetails.error) return res.status(400).send(validNewCardDetails.error.details[0].message);

    // getting today's date
    const today = new Date();

    try {

        // creating a new virtual card

        const newCard = await Card.create({...validNewCardDetails.value, expiryDate: new Date(today.setFullYear(today.getFullYear() + 4)), cvv: Math.floor(Math.random() * 900 + 100)});
        // console.log(newCard);
        return res.status(201).send(newCard);

    } catch (error) {
        console.log(error);
        return res.status(500).send('Virtual card creation failed');
    }
}

exports.get_card_detail = async (req, res) => {
    // getting the cards that exist for the logged in user
    const cardDetailsForUser = await Card.find({ owner: req.user._id });
    return res.status(200).send(cardDetailsForUser);
}

exports.fund_card = async (req, res) => {    
    const { id } = req.params;

    // validating request body and sending back appropriate error messages if any
    const { amount } = req.body;
    if (!amount) return res.status(400).send("'amount' required.");
    if (isNaN(Number(amount))) return res.status(400).send("'number' must be a number");
    if (Number(amount) > 10000) return res.status(403).send("Amount must be 10000 or less");
    // if (!cardType) return res.status(400).send("'cardType' required");
    // if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);
    
    // if (cardType === 'physical') return res.status(200).send('Still in development');

    // validating card exists for user
    const cardDetailsForUser = await Card.findOne({ owner: req.user._id, _id: id });
    if (!cardDetailsForUser) return res.status(404).send('Virtual card not found for user.');


    // updating the card balance of the user
    cardDetailsForUser.balance += Number(amount);

    // creating and validating a new transaction 
    const newValidTransaction = validateNewTransactionDetails(
        generateNewTransactionObj(
            req.user._id,
            'credit',
            'Card funding',
            amount,
            'success',
            cardDetailsForUser.currency,
        )
    )
    if (newValidTransaction.error) return res.status(400).send(newValidTransaction.error.details[0].message);

    // contructing an email of the transaction
    const newFundingMailContent = compileHtml(
        `${req.user.firstName} ${req.user.lastName}`, 
        `You successfully funded your card with ${cardDetailsForUser.currency} ${amount}`,
        { 
            currency: cardDetailsForUser.currency, 
            amount: amount,
        },
        'newFunding',
        'card'
    )

    try {
        await Promise.all([
            cardDetailsForUser.save(),
            Transaction.create({...newValidTransaction.value, cardId: cardDetailsForUser._id}),
            Notification.create({
                owner: req.user._id,
                content: `You successfuly funded your wallet with ${cardDetailsForUser.currency} ${amount}`,
            }),
            sendEmail(req.user.email, 'Card Funding', newFundingMailContent),
        ])    

        return res.status(200).send(cardDetailsForUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Card funding failed');
    }
}


exports.fetch_card_transactions = async (req, res) => {
    const { id } = req.params;

    // // validating request body and sending back appropriate error messages if any
    // const { cardType } = req.body;
    // if (!cardType) return res.status(400).send("'cardType' required");
    // if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);
    
    // if (cardType === 'physical') return res.status(200).send('Still in development');

    // validating card exists for user
    const cardExistsForUser = await Card.findOne({ owner: req.user._id, _id: id });
    if (!cardExistsForUser) return res.status(404).send('Transactions fetching failed because virtual card cannot be found for user.');

    // fetching top 50 transactions
    const transactions = await Transaction.find({ owner: req.user._id, cardId: cardExistsForUser._id, currency: cardExistsForUser.currency }).sort({ createdAt: -1 }).limit(50).lean();
    return res.status(200).send(transactions);
}

exports.get_single_card_detail = async (req, res) => {
    const { id } = req.params;

    try {
        // checking if there is a card matching the 'id' passed that exists for the logged in user
        const foundCard = await Card.findOne({ owner: req.user._id, _id: id });
        if (!foundCard) return res.status(404).send('No matching card found for user')   

        // sending the details
        return res.status(200).send(foundCard);     
    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while trying to fetch your card detail')
    }

}

exports.update_card_setting = async (req, res) => {
    const { id, type } = req.params;
    const { newValue } = req.body;

    // validating request params and sending back appropriate error messages if any
    if (!type) return res.status(400).send("'type' missing in request params");
    if (!validCardSettingsUpdate.includes(type)) return res.status(400).send(`'type' can only be one of ${validCardSettingsUpdate.join(', ')}`);

    // validating request body and sending back appropriate error messages if any
    if (!newValue) return res.status(400).send("'newValue' missing in request body");

    let passedVal;
    try {
        passedVal = JSON.parse(newValue);
    } catch (error) {
        console.log("'newValue'parse error: ", error);
        return res.status(400).send("'newValue' can only be a boolean");
    }

    if (typeof passedVal !== 'boolean') return res.status(400).send("'newValue' can only be a boolean");

    let foundCard;

    try {
        // checking if there is a card matching the 'id' passed that exists for the logged in user
        foundCard = await Card.findOne({ owner: req.user._id, _id: id });
    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while trying to update your card detail')
    }

    if (!foundCard) return res.status(404).send('No matching card found for user');

    // updating the card detail
    foundCard[type] = newValue;

    try {
        // saving the updates made
        await foundCard.save();
        return res.status(200).send(foundCard);
    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while trying to update your card detail')
    }
}