const Flutterwave = require('flutterwave-node-v3');
const { formatDateAndTime } = require("../utils/dateUtil");
const { Card } = require('../models/cards');
const { funolaValidCurrencies, funolaValidCardTypes } = require('../utils/utils');

exports.flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.create_new_card = async (req, res) => {
    // validating request parameters and sending back appropriate error messages if any
    const { cardType } = req.params;
    if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);

    if (cardType === 'physical') return res.status(202).send("Feature still in development");

    // validating request body and sending back appropriate error messages if any
    const { currency } = req.body;
    if (!currency) return res.status(400).send("'currency' required");
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);

    // checking if the user's account has not yet been verified
    if (!req.user.accountVerified) return res.status(401).send('Kindly verify your account first');
    
    // checking if the user already has requested virtual card with the passed 'currency'
    const userHasCard = await Card.findOne({ owner: req.user._id, currency: currency });
    if (userHasCard) return res.status(409).send(`${currency} ${cardType} card creation failed because user already has one`);

    try {
        // payload for creating a new virtual card
        const payload = {
            "currency": currency,
            "amount": 0,
            "first_name": req.user.firstName,
            "last_name": req.user.lastName,
            "date_of_birth": formatDateAndTime(req.user.dateOfBirth),
            "email": req.user.email,
            "phone": req.user.phoneNumber,
            "title": req.user.title,
            "gender": req.user.gender,
        }

        // creating a new virtual card using flutterwave
        const response = await flw.VirtualCard.create(payload);
        console.log(response);
        // await Card.create({
        //     owner: req.user._id,
        //     cardId: ,
        //     cardType: cardType,
        //     currency: currency,
        // })
        return res.status(200).send('Still in development.');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Virtual card creation failed');
    }
}

exports.get_card_detail = async (req, res) => {
    // validating request body and sending back appropriate error messages if any
    const { cardType, currency, id } = req.body;
    if (!cardType) return res.status(400).send("'cardType' required");
    if (!currency) return res.status(400).send("'currency' required");
    if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);

    if (cardType === 'physical') return res.status(200).send('Still in development');

    if (!id) return res.status(400).send("'id' required");

    // validating card exists for user
    const cardDetailsForUser = await Card.findOne({ owner: req.user._id, cardId: id, currency: currency });
    if (!cardDetailsForUser) return res.status(404).send('Virtual card not found for user.');

    try {
        // fetching the card details from flutterwave
        const cardResponse = await flw.VirtualCard.fetch({ "id": id });
        console.log(cardResponse);
        return res.status(200).send('Still in development');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Virtual card fetching failed');
    }
}

exports.fund_card = async (req, res) => {
    const { currency } = req.params;
    
    // validating request param and sending back appropriate error messages if any
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);
    
    // validating request body and sending back appropriate error messages if any
    const { amount, cardType, id } = req.body;
    if (!amount) return res.status(400).send("'amount' required.");
    if (isNaN(Number(amount))) return res.status(400).send("'number' must be a number");
    if (!cardType) return res.status(400).send("'cardType' required");
    if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);
    
    if (cardType === 'physical') return res.status(200).send('Still in development');

    if (!id) return res.status(400).send("'id' required");

    // validating card exists for user
    const cardDetailsForUser = await Card.findOne({ owner: req.user._id, cardId: id, currency: currency });
    if (!cardDetailsForUser) return res.status(404).send('Virtual card not found for user.');

    try {
        // payload for funding a existing virtual card
        const payload = {
            "id": id,
            "amount": amount,
            "debit_currency": cardType,
        }

        // funding the card using flutterwave
        const response = await flw.VirtualCard.fund(payload);
        console.log(response);
        return res.status(200).send('Still in development');

    } catch (error) {
        console.log(error)
        return res.status(500).send('Virtual card funding failed');
    }
}


exports.fetch_card_transactions = async (req, res) => {
    const { currency } = req.params;
    
    // validating request param and sending back appropriate error messages if any
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);

    // validating request body and sending back appropriate error messages if any
    const { cardType, id } = req.body;
    if (!cardType) return res.status(400).send("'cardType' required");
    if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);
    
    if (cardType === 'physical') return res.status(200).send('Still in development');

    if (!id) return res.status(400).send("'id' required");

    // validating card exists for user
    const cardExistsForUser = await Card.findOne({ owner: req.user._id, cardId: id, currency: currency });
    if (!cardExistsForUser) return res.status(404).send('Transactions fetching failed because virtual card cannot be found for user.');

    try {
        // payload for fetching transations of a existing virtual card
        const payload = {
            "id": id,
            "from": formatDateAndTime(cardExistsForUser.createdAt),
            "to": formatDateAndTime(new Date()),
            "index": "0",
            "size": "5",
        }

        const response = await flw.VirtualCard.transactions(payload)
        console.log(response);
        return res.status(200).send('Still in development');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Transaction fetching of virtual card funding failed');
    }
}
