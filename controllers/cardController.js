const { Card, validateNewCardDetails, validCardSettingsUpdate } = require('../models/cards');
const { funolaValidCurrencies, funolaValidCardTypes, funolaValidCardPaymentNetworks, validCardTransferTypes, validateMongooseId } = require('../utils/utils');
const { generateNewTransactionObj, validateNewTransactionDetails, Transaction } = require("../models/transaction");
const { Notification } = require("../models/notifications");
const { compileHtml, sendEmail } = require("../utils/emailUtils");
const { Wallet } = require('../models/wallet');
const { User } = require('../models/user');
const { Bank } = require('../models/banks');
const { RecentMobileTransfer, validateRecentMobileTransfer } = require('../models/recentMobileTransfers');

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
    const { amount, currency } = req.body;

    // validating request body and sending back appropriate error messages if any
    if (!amount) return res.status(400).send("'amount' required.");
    if (!currency) return res.status(400).send("'currency' required.");
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);
    // if (isNaN(Number(amount))) return res.status(400).send("'number' must be a number");
    // if (!cardType) return res.status(400).send("'cardType' required");
    // if (!funolaValidCardTypes.includes(cardType)) return res.status(400).send(`'cardType' can only be one of ${funolaValidCardTypes.join(', ')}`);
    
    // if (cardType === 'physical') return res.status(200).send('Still in development');

    // checking if the user has a wallet in the requested currency
    const existingWalletOfUser = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (!existingWalletOfUser) return res.status(403).send(`Funding failed. You do not have a ${currency} wallet.`);

    // validating the user has a wallet with sufficient balance in the requested currency
    if (existingWalletOfUser.balance < amount) return res.status(403).send("You do not have sufficient funds in your wallet to initiate this funding.");

    // validating card exists for user
    const cardDetailsForUser = await Card.findOne({ owner: req.user._id, _id: id, currency: currency });
    if (!cardDetailsForUser) return res.status(404).send('Virtual card not found for user.');

    // updating the wallet balance of the user
    existingWalletOfUser.balance -= Number(amount);

    // updating the card balance of the user
    cardDetailsForUser.balance += Number(amount);

    // creating and validating new transactions for the wallet and card updates
    const [
        newValidCardTransaction,
        newValidWalletTransaction,
    ] = [
        validateNewTransactionDetails(
            generateNewTransactionObj(
                req.user._id,
                'credit',
                'Card funding',
                amount,
                'success',
                cardDetailsForUser.currency,
            )
        ),
        validateNewTransactionDetails(
            generateNewTransactionObj(
                req.user._id,
                'debit',
                'Wallet debit for card funding',
                amount,
                'success',
                existingWalletOfUser.currency,
            )
        ),
    ]
    if (newValidCardTransaction.error) return res.status(400).send(newValidCardTransaction.error.details[0].message);
    if (newValidWalletTransaction.error) return res.status(400).send(newValidWalletTransaction.error.details[0].message);

    // constructing emails of the transactions
    const [
        newFundingMailContent,
        newWithdrawalMailContent,
    ] = [
        compileHtml(
            `${req.user.firstName} ${req.user.lastName}`, 
            `You successfully funded your card with ${cardDetailsForUser.currency} ${amount}`,
            { 
                currency: cardDetailsForUser.currency, 
                amount: amount,
            },
            'newFunding',
            'card'
        ),
        compileHtml(
            `${req.user.firstName} ${req.user.lastName}`, 
            `Your ${currency} wallet was successfully debited ${currency} ${amount} to fund your card.`,
            { 
                currency: currency, 
                amount: amount,
            },
            'debit',
            'withdrawal'
        ),
    ]

    const [
        newTransactionForCard,
        newNotificationForCard,
        newTransactionForWallet,
        newNotificationForWallet,
    ] = [
        new Transaction({...newValidCardTransaction.value, cardId: cardDetailsForUser._id}),
        new Notification({
            owner: req.user._id,
            content: `You successfuly funded your card with ${cardDetailsForUser.currency} ${amount}`,
        }),
        new Transaction(newValidWalletTransaction.value),
        new Notification({
            owner: req.user._id,
            content: `Your wallet was successfuly debited ${existingWalletOfUser.currency} ${amount} to fund your card`,
        }),
    ]

    try {
        await Promise.all([
            existingWalletOfUser.save(),
            cardDetailsForUser.save(),
            
            newTransactionForCard.save(),
            newNotificationForCard.save(),

            newTransactionForWallet.save(),
            newNotificationForWallet.save(),

            sendEmail(req.user.email, 'Card Funding', newFundingMailContent),
            sendEmail(req.user.email, 'Wallet Debit', newWithdrawalMailContent),
        ])    

        return res.status(200).send({
            updatedDebitedWalletDetails: existingWalletOfUser,
            updatedCardDetails: cardDetailsForUser,
            newCardTransaction: newTransactionForCard,
            notificationForCard: newNotificationForCard,
            newWalletTransaction: newTransactionForWallet,
            notificationForWallet: newNotificationForWallet,
        });
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

exports.transfer_fund = async (req, res) => {
    const { id, type } = req.params;
    if (!validCardTransferTypes.includes(type)) return res.status(400).send(`'type' can only be one of ${validCardTransferTypes.join(', ')}`);

    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    // validating the request body and sending back an appropriate error message if any
    const { bankId, receiverId, pin, remarks, receiveInWallet } = req.body;
    if (!pin) return res.status(400).send("'pin' required");
    if (isNaN(Number(pin))) return res.status(400).send("'pin' must be a number");
    if (String(pin).length !== 6) return res.status(400).send("Please enter a 6-digit number for the 'pin'");

    // getting the current user and current user's card
    const [ currentUser, existingCardOfSender ] = await Promise.all([
        User.findById(req.user._id),
        Card.findOne({ owner: req.user._id, _id: id, currency: currency }),
    ])

    // checking the user has set a pin
    if (!currentUser.transactionPin) return res.status(403).send("Please set a transaction pin first");

    // checking the pin passed is correct
    const isValidPin = await bcrypt.compare(String(pin), currentUser.transactionPin);
    if (!isValidPin) return res.status(401).send('Incorrect transaction pin');

    // checking if the sending user has a card and sufficient balance in the requested currency
    if (!existingCardOfSender) return res.status(403).send(`Transfer failed. You do not have a ${currency} card.`);
    if (existingCardOfSender.balance < amount) return res.status(403).send("You do not have sufficient funds to initiate this transfer.");

    // BANK TRANSFER
    if (type === "bank") {
        // validating required keys in the request body
        if (!bankId) return res.status(400).send("'bankId' required");
        if (!validateMongooseId(bankId)) return res.status(400).send("Invalid receiver bank id passed");

        let receivingBank;

        try {
            // fetching the bank details
            receivingBank = await Bank.findOne({ _id: bankId, owner: req.user._id });
        } catch (error) {
            return res.status(500).send('Something went wrong while trying to process your transfer request. Please try again later');
        }

        // checking the bank exists
        if (!receivingBank) return res.status(403).send("Transfer failed. Bank detail not found for user");
        
        // constructing and validating a transaction object record for the wallet-to-bank transfer
        const validNewBankTransaction = validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'debit', remarks ? remarks : 'Bank Payout', amount, 'success', currency))
        if (validNewBankTransaction.error) return res.status(400).send(validNewBankTransaction.error.details[0].message);
        
        // updating the sender's balance
        existingCardOfSender.balance -= amount;

        // creating a new transaction record, notification and saving the user's card updates to the db
        await Promise.all([
            Transaction.create({...validNewBankTransaction.value, cardId: existingCardOfSender._id}),
            existingCardOfSender.save(),

            Notification.create({
                owner: req.user._id,
                content: `You made a withdrawal of ${currency} ${amount} to your ${receivingBank?.name} account.`,
            }),
        ])

        // constructing emails for both sender and receiver
        const newBankWithdrawalMailContent = compileHtml(
            `${req.user.firstName} ${req.user.lastName}`, 
            `You successfully made a withdrawal of ${currency} ${amount} to your ${receivingBank.name} account`,
            { 
                currency: currency, 
                amount: amount,
            },
            'debit',
            'transfer'
        );

        // sending a mail to the user inform of successful wallet transfer
        await sendEmail(req.user.email, 'Successful Bank Transfer', newBankWithdrawalMailContent)

        return res.status(200).send('Successfully transferred funds!');
    }

    // validating required keys in the request body
    if (!receiverId) return res.status(400).send("'receiverId' required");
    if (!validateMongooseId(receiverId)) return res.status(400).send("Invalid receiver user id passed");
    if (receiverId === req.user._id) return res.status(403).send("You cannot transfer funds from yourself to yourself");
    
    // declaring a variable to track if the funds are to be transfered to the receiver's wallet or card
    const fundsAreToBeTransferredToCard = receiveInWallet === false ?
        true
        :
    false;

    // getting the receiving user, receiving user wallet and current user recent transfers
    const [ receivingUser, existingWalletOfReceiver, existingCardOfReceiver, currentUserRecentTransfers ] = await Promise.all([
        User.findById(receiverId),
        Wallet.findOne({ owner: receiverId, currency: currency }),
        Card.findOne({ owner: receiverId, currency: currency }),
        RecentMobileTransfer.find({ owner: req.user._id }).sort({ createdAt: -1 }),
    ]);

    // checking the receiver user exists
    if (!receivingUser) return res.status(403).send("Transfer failed. User not found");

    // checking if the receiving user has a wallet in the requested currency
    if (!existingWalletOfReceiver && !fundsAreToBeTransferredToCard) return res.status(403).send(`Transfer failed. Receiver does not have a ${currency} wallet.`);

    // checking if the receiving user has a card in the requested currency
    if (!existingCardOfReceiver && fundsAreToBeTransferredToCard) return res.status(403).send(`Transfer failed. Receiver does not have a ${currency} card.`);

    // constructing and validating transaction object records for sender and receiver
    const [validNewSenderTransaction, validNewReceiverTransaction] = [
        validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'transfer', remarks ? remarks : 'Card transfer', amount, 'success', currency, receiverId)),
        validateNewTransactionDetails(generateNewTransactionObj(receiverId, 'credit', remarks ? remarks : 'Wallet topup', amount, 'success', currency)),
    ]
    if (validNewSenderTransaction.error) return res.status(400).send(validNewSenderTransaction.error.details[0].message);
    if (validNewReceiverTransaction.error) return res.status(400).send(validNewReceiverTransaction.error.details[0].message);

    // constructing and validating recent transfer object record
    const validNewRecentTransfer = validateRecentMobileTransfer({
        owner: req.user._id,
        userId: receiverId,
        userPhoneNumber: receivingUser.phoneNumber,
        userPhoneNumberExtension: receivingUser.phoneNumberExtension,
        userGender: receivingUser.gender,
    })
    if (validNewRecentTransfer.error) return res.status(400).send(validNewRecentTransfer.error.details[0].message);

    // deleting the previous transfer record with the same receiver
    const receiverIsInRecents = currentUserRecentTransfers.find(item => item.userId === receiverId)
    if (receiverIsInRecents) {
        await RecentMobileTransfer.deleteOne({ _id: receiverIsInRecents._id })
    }

    // ensuring that the user only has 5 or less recent transfer records for optimization purposes
    if (currentUserRecentTransfers.length === 5 && !receiverIsInRecents) {
        await RecentMobileTransfer.deleteOne({ _id: currentUserRecentTransfers[currentUserRecentTransfers.length - 1]?._id })
    }

    // creating new transfer for sender, new transaction records for sender and receiver
    await Promise.all(
        [
            RecentMobileTransfer.create(validNewRecentTransfer.value),
            Transaction.create({...validNewSenderTransaction.value, cardId: existingCardOfSender._id}),
            Transaction.create(
                fundsAreToBeTransferredToCard ?
                    {...validNewReceiverTransaction.value, cardId: existingCardOfReceiver._id}
                    :
                {...validNewReceiverTransaction.value, walletId: existingWalletOfReceiver._id}
            ),
        ]
    );
    
    // updating the sender's balance
    existingCardOfSender.balance -= amount;

    // updating the receiver's balance
    if (!fundsAreToBeTransferredToCard) existingWalletOfReceiver.balance += amount;
    if (fundsAreToBeTransferredToCard) existingCardOfReceiver.balance += amount;

    // saving the updates to the db and creating notifications for both users
    await Promise.all([
        existingCardOfSender.save(),
        !fundsAreToBeTransferredToCard ? existingWalletOfReceiver.save() : existingCardOfReceiver.save(),
        Notification.create({
            owner: req.user._id,
            content: `You made a transfer of ${currency} ${amount} to #${receiverId}!#`,
        }),
        Notification.create({
            owner: receiverId,
            content: `You received a transfer of ${currency} ${amount} from #${req.user._id}!#`,
        })
    ])

    // constructing emails for both sender and receiver
    const [newFundingMailContent, newWithdrawalMailContent] = [
        compileHtml(
            `${receivingUser.firstName} ${receivingUser.lastName}`, 
            `You successfully received a transfer of ${currency} ${amount} from ${req.user.firstName} ${req.user.lastName}`,
            { 
                currency: currency, 
                amount: amount,
            },
            'newFunding',
            'wallet'
        ),
        compileHtml(
            `${req.user.firstName} ${req.user.lastName}`, 
            `You successfully made a transfer of ${currency} ${amount} to ${receivingUser.firstName} ${receivingUser.lastName}`,
            { 
                currency: currency, 
                amount: amount,
            },
            'debit',
            'transfer'
        ),
    ]

    // sending a mail to both sender and receiver to inform of successful wallet transfer
    await Promise.all([
        sendEmail(receivingUser.email, 'Wallet Topup', newFundingMailContent),
        sendEmail(req.user.email, 'Successful Card Transfer', newWithdrawalMailContent),
    ])

    return res.status(200).send('Successfully transferred funds!');
}