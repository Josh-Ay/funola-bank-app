const { generateNewTransactionObj, validateNewTransactionDetails, Transaction } = require('../models/transaction');
const { User } = require('../models/user');
const { Wallet } = require('../models/wallet');
const { compileHtml, sendEmail } = require('../utils/emailUtils');
const { validateMongooseId, checkWalletRequestBodyErrors, funolaValidCurrencies, validWalletTransferTypes } = require('../utils/utils');
const { Notification } = require("../models/notifications");
const { get_currency_rate } = require("../utils/convertUtil");
const bcrypt = require('bcrypt');
const { validateRecentMobileTransfer, RecentMobileTransfer } = require('../models/recentMobileTransfers');
const { Bank } = require('../models/banks');

exports.create_wallet = async (req, res) => {
    // checking the user has verified account
    if (!req.user.accountVerified) return res.status(401).send('Kindly verify your account first');

    // validating the request body and sending back an appropriate error message if any
    const { currency } = req.body;
    if (!currency) return  res.status(400).send("'currency' required");
    if (!funolaValidCurrencies.includes(currency)) return res.status(400).send(`'currency' can only be one of ${funolaValidCurrencies.join(', ')}`);

    // checking if the user already has a wallet in the requested currency
    const existingWalletOfUser = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (existingWalletOfUser) return res.status(409).send(`User already has a ${currency} wallet.`);

    // creating a new wallet for the user
    const newWallet = await Wallet.create({
        owner: req.user._id,
        currency: currency,
    })

    // creating a new notification for the user
    await Notification.create({
        owner: req.user._id,
        content: `Fund your new ${currency} wallet now!`,
    })

    // sending back the details of the newly created wallet
    return res.status(201).send(newWallet);
}

exports.get_wallet_balance = async (req, res) => {
    // getting the wallets for the user
    const existingWalletsForUser = await Wallet.find({ owner: req.user._id }).lean();
    if (existingWalletsForUser.length < 1) return res.status(200).send([]);

    return res.status(200).send(existingWalletsForUser);
}

exports.fund_wallet = async (req, res) => {
    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);
    
    // if (Number(amount) > 10000) return res.status(403).send("Amount must be 10000 or less");

    // checking if the user has a wallet in the requested currency
    const existingWalletOfUser = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (!existingWalletOfUser) return res.status(403).send(`Funding failed. You do not have a ${currency} wallet.`);

    // constructing and validating a transaction object record
    const validNewTransaction = validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'credit', 'Wallet funding', amount, 'success', currency));
    if (validNewTransaction.error) return res.status(400).send(validNewTransaction.error.details[0].message);
    
    // sending a mail to inform of successful wallet funding
    const newFundingMailContent = compileHtml(
        `${req.user.firstName} ${req.user.lastName}`, 
        `You successfully funded your wallet with ${currency} ${amount}`,
        { 
            currency: currency, 
            amount: amount,
        },
        'newFunding',
        'wallet'
    );

    let existingUser;

    try {
        // getting the current user
        existingUser = await User.findById(req.user._id);

        // deducting the requested amount from the user's daily limit to restrict ludricrous funding
        if (currency === 'NGN') existingUser.dailyNairaTopupLimit -= amount;
        if (currency === 'USD') existingUser.dailyDollarTopupLimit -= amount;

    } catch (error) {
        return res.status(500).send('Wallet funding failed');
    }

    // updating the user's balance
    existingWalletOfUser.balance += amount;
    
    await Promise.all([

        // creating a new transaction record
        Transaction.create({ ...validNewTransaction.value, walletId: existingWalletOfUser._id }),

        sendEmail(req.user.email, 'Successful Wallet Funding', newFundingMailContent),

        existingWalletOfUser.save(),
        existingUser.save(),
    ])

    return res.status(200).send('Wallet funding successful!');
}

exports.transfer_fund = async (req, res) => {
    const { type } = req.params;
    if (!validWalletTransferTypes.includes(type)) return res.status(400).send(`'type' can only be one of ${validWalletTransferTypes.join(', ')}`);

    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    // validating the request body and sending back an appropriate error message if any
    const { bankId, receiverId, pin, remarks } = req.body;

    if (!pin) return res.status(400).send("'pin' required");
    if (isNaN(Number(pin))) return res.status(400).send("'pin' must be a number");
    if (String(pin).length !== 6) return res.status(400).send("Please enter a 6-digit number for the 'pin'");

    // getting the current user and current user's wallet
    const [ currentUser, existingWalletOfSender ] = await Promise.all([
        User.findById(req.user._id),
        Wallet.findOne({ owner: req.user._id, currency: currency }),
    ])

    // checking the user has set a pin
    if (!currentUser.transactionPin) return res.status(403).send("Please set a transaction pin first");

    // checking the pin passed is correct
    const isValidPin = await bcrypt.compare(String(pin), currentUser.transactionPin);
    if (!isValidPin) return res.status(401).send('Incorrect transaction pin');
    
    // checking if the sending user has a wallet and sufficient balance in the requested currency
    if (!existingWalletOfSender) return res.status(403).send(`Transfer failed. You do not have a ${currency} wallet.`);
    if (existingWalletOfSender.balance < amount) return res.status(403).send("You do not have sufficient funds to initiate this transfer.");


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
        existingWalletOfSender.balance -= amount;

        // creating a new transaction record, notification and saving the user's wallet updates to the db
        await Promise.all([
            Transaction.create({...validNewBankTransaction.value, walletId: existingWalletOfSender._id}),
            existingWalletOfSender.save(),

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

    // getting the receiving user, receiving user wallet and current user recent transfers
    const [ receivingUser, existingWalletOfReceiver, currentUserRecentTransfers ] = await Promise.all([
        User.findById(receiverId),
        Wallet.findOne({ owner: receiverId, currency: currency }),
        RecentMobileTransfer.find({ owner: req.user._id }).sort({ createdAt: -1 }),
    ]);

    // checking the receiver user exists
    if (!receivingUser) return res.status(403).send("Transfer failed. User not found");

    // checking if the receiving user has a wallet in the requested currency
    if (!existingWalletOfReceiver) return res.status(403).send(`Transfer failed. Receiver does not have a ${currency} wallet.`);

    // constructing and validating transaction object records for sender and receiver
    const [validNewSenderTransaction, validNewReceiverTransaction] = [
        validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'transfer', remarks ? remarks : 'Wallet transfer', amount, 'success', currency, receiverId)),
        validateNewTransactionDetails(generateNewTransactionObj(receiverId, 'credit', remarks ? remarks : 'Wallet transfer', amount, 'success', currency)),
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
            Transaction.create({...validNewSenderTransaction.value, walletId: existingWalletOfSender._id}),
            Transaction.create({...validNewReceiverTransaction.value, walletId: existingWalletOfReceiver._id}),
        ]
    );
    
    // updating the sender's balance
    existingWalletOfSender.balance -= amount;

    // updating the receiver's balance
    existingWalletOfReceiver.balance += amount;

    // saving the updates to the db and creating notifications for both users
    await Promise.all([
        existingWalletOfSender.save(),
        existingWalletOfReceiver.save(),
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
        sendEmail(receivingUser.email, 'Wallet Transfer', newFundingMailContent),
        sendEmail(req.user.email, 'Successful Wallet Transfer', newWithdrawalMailContent),
    ])

    return res.status(200).send('Successfully transferred funds!');
}

exports.withdraw_from_wallet = async (req, res) => {
    const { pin } = req.body

    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);
    if (!pin) return res.status(400).send("'pin' required");

    if (isNaN(Number(pin))) return res.status(400).send("'pin' must be a number");
    if (String(pin).length !== 6) return res.status(400).send("Please enter a 6-digit number for the 'pin'");

    // validating the user has a wallet with sufficient balance in the requested currency
    const existingWallet = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (!existingWallet) return res.status(403).send(`Withdrawal failed. You do not have a ${currency} wallet.`);
    if (existingWallet.balance < amount) return res.status(403).send("You do not have sufficient funds to initiate this withdrawal.");

    // checking the user has set a pin
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.transactionPin) return res.status(403).send("Please set a transaction pin first");

    // checking the pin passed is correct
    const isValidPin = await bcrypt.compare(String(pin), currentUser.transactionPin);
    if (!isValidPin) return res.status(401).send('Incorrect transaction pin');

    // updating the user's balance
    existingWallet.balance -= amount;

    // constructing a new mail for the user
    const newWithdrawalMailContent = compileHtml(
        `${req.user.firstName} ${req.user.lastName}`, 
        `You successfully made a withdrawal of ${currency} ${amount}. You will get funds in 1 working day.`,
        { 
            currency: currency, 
            amount: amount,
        },
        'debit',
        'withdrawal'
    );

    // constructing and validating a new transaction object
    const validNewTransaction = validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'debit', 'Wallet withdrawal', amount, 'pending', currency));
    if (validNewTransaction.error) return res.status(400).send(validNewTransaction.error.details[0].message);
    
    await Promise.all([
        // creating a new transaction
        Transaction.create({...validNewTransaction.value, walletId: existingWallet._id}),

        // updating the db
        existingWallet.save(),

        // sending a mail to inform of successful wallet withdrawal
        sendEmail(req.user.email, 'Successful Wallet Withdrawal', newWithdrawalMailContent),
        
        // creating a new notification for the user
        Notification.create({
            owner: req.user._id,
            content: `You made a withdrawal of ${currency} ${amount}`,
        }),
    ])

    return res.status(200).send("Successfully withdrew funds from wallet.");
}

exports.swap_currency = async (req, res) => {
    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    const { outputCurrency } = req.body;
    if (!outputCurrency) return res.status(400).send("'outputCurrency' required");
    if (!funolaValidCurrencies.includes(outputCurrency)) return res.status(400).send(`'outputCurrency' can only be one of ${funolaValidCurrencies.join(', ')}`);


    // checking if the user has the respective wallets to make the swap
    const [userWalletInInputCurrency, userWalletInOutputCurrency] = await Promise.all([
        Wallet.findOne({ owner: req.user._id, currency: currency }),
        Wallet.findOne({ owner: req.user._id, currency: outputCurrency }),
    ]);

    // returning an error message if the user does not have either one of the wallet's currency
    if (!userWalletInInputCurrency) return res.status(403).send(`Swap failed. You do not have a ${currency} wallet`);
    if (!userWalletInOutputCurrency) return res.status(403).send(`Swap failed. You do not have a ${outputCurrency} wallet`);

    // returning an error message if the user does not have enough in the originating wallet
    if (userWalletInInputCurrency.balance < amount) return res.status(403).send("You do not have sufficient funds to initiate this swap.");

    try {
        const result = (await get_currency_rate(amount, currency, outputCurrency)).data;
        // console.log(result);

        const successMessage = `You successfully swapped ${amount}${currency} for ${result.value}${outputCurrency}!`;
        
        // constructing a new mail to inform the user of the swap
        const swapMailContent = compileHtml(
            `${req.user.firstName} ${req.user.lastName}`, 
            successMessage,
            { 
                currency: currency, 
                amount: amount,
                rate: result.rate,
                amountReceived: result.value,
                currencyReceived: result.result_currency,
            },
            'swap',
        );

        // constructing and validating a new transaction object
        const validNewTransaction = validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'swap', 'Wallet swap', amount, 'success', currency));
        if (validNewTransaction.error) return res.status(400).send(validNewTransaction.error.details[0].message);

        // crediting/debiting the respective amounts to/from both wallets
        userWalletInInputCurrency.balance -= amount,
        userWalletInOutputCurrency.balance += result.value

        await Promise.all([
            // creating new transactions for both wallets
            Transaction.create({...validNewTransaction.value, walletId: userWalletInInputCurrency._id}),
            Transaction.create({...validNewTransaction.value, walletId: userWalletInOutputCurrency._id}),
    
            // persisting the update of the wallets to the db
            userWalletInInputCurrency.save(),
            userWalletInOutputCurrency.save(),
    
            // sending a mail to inform of successful wallet withdrawal
            sendEmail(req.user.email, 'Successful Wallet Swap', swapMailContent),
            
            // creating a new notification for the user
            Notification.create({
                owner: req.user._id,
                content: successMessage,
            }),
        ])

        return res.status(200).json({
            message: successMessage,
            rateOfExchange: result.rate,
            currencyOfDebitedWallet: userWalletInInputCurrency.currency,
            newBalOfDebitedWallet: userWalletInInputCurrency.balance,
            newBalOfCreditedWallet: userWalletInOutputCurrency.balance,
            currencyOfCreditedWallet: userWalletInOutputCurrency.currency,
        })

    } catch (error) {
        console.log(error);
        return res.status(
            error?.response?.status ? 
                error.response.status : 
                500
        )
        .send(
            error?.response?.data ? 
                error?.response?.data : 
                'Swap failed'
        );
    }
}

exports.request_fund = async (req, res) => {

    // validating the request body and sending back an appropriate error message if any
    const { creditorId } = req.body;
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);
    if (!creditorId) return res.status(400).send("'creditorId' required");

    // validating the 'creditorId' passed
    const isValidUserId = validateMongooseId(creditorId);
    if (!isValidUserId) return res.status(400).send("Invalid 'creditorId' passed");

    // checking that the logged in user and the proposed creditor are not the same 
    if (req.user._id === creditorId) return res.status(403).send("You cannot request for funding from yourself");

    // checking if the crediting user exists
    const creditingUser = await User.findById(creditorId);
    if (!creditingUser) return res.status(404).send("Funding request failed because the crediting user cannot be found");

    await Promise.all([
        
        // creating a new notification for the both users
        Notification.create({
            owner: req.user._id,
            content: `You requested for ${currency}${amount} from #${creditorId}!#`,
        }),

        Notification.create({
            owner: creditorId,
            content: `#${req.user._id}!# is requesting for ${currency}${amount}`,
        }),
    ])

    return res.status(200).send(`Successfully requested for ${currency}${amount} from ${creditingUser.firstName} ${creditingUser.lastName}`)
}

exports.get_recent_transfer_recipients = async (req, res) => {
    try {
        const recents = await RecentMobileTransfer.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();
        const updatedRecentsWithName = await Promise.all(
            recents.map(async (recent) => {
                const foundUser = await User.findById(recent.userId).lean().select('firstName lastName');
                if (!foundUser) return null
                return {
                    ...recent,
                    nameOfUser: `${foundUser.firstName} ${foundUser.lastName}`
                }
            }).filter(item => item)
        )
        return res.status(200).send(updatedRecentsWithName);
    } catch (error) {
        return res.status(500).send('An error occured while trying to get your recents')
    }
}

exports.get_wallet_transactions = async (req, res) => {
    const { id } = req.params;

    let existingWalletOfUser
    try {
        // validating wallet exists for user
        existingWalletOfUser =  await Wallet.findOne({ owner: req.user._id, _id: id });
        if (!existingWalletOfUser) return res.status(404).send('Transactions fetching failed because wallet cannot be found for user.');

    } catch (error) {
        return res.status(500).send('An error occurred while trying to fetch your wallet transactions')
    }

    try {
        // fetching top 50 transactions
        const transactions = await Transaction.find({ owner: req.user._id, walletId: existingWalletOfUser._id }).sort({ createdAt: -1 }).limit(50).lean();

        // modifying the fetched transactions to include recipient's name
        const updatedTransactions = await Promise.all(transactions.map(async (transaction) => {
            if (transaction.recipientInfo.length < 1) return transaction
            
            const foundRecipientUserDetail = await User.findById(transaction.recipientInfo).lean().select('firstName lastName');
            if (!foundRecipientUserDetail) return {
                ...transaction, 
                recipientInfo: ''
            };

            return {
                ...transaction,
                recipientInfo: `${foundRecipientUserDetail.firstName} ${foundRecipientUserDetail.lastName}`
            }
        }))

        return res.status(200).send(updatedTransactions);
    } catch (error) {
        return res.status(500).send('An error occurred while trying to fetch your wallet transactions')
    }
}

exports.clear_wallet_transaction = async (req, res) => {
    // TODO: use CRON to run in background

}