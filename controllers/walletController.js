const { generateNewTransactionObj, validateNewTransactionDetails, Transaction } = require('../models/transaction');
const { User } = require('../models/user');
const { Wallet } = require('../models/wallet');
const { compileHtml, sendEmail } = require('../utils/emailUtils');
const { validateMongooseId, checkWalletRequestBodyErrors, funolaValidCurrencies } = require('../utils/utils');
const { Notification } = require("../models/notifications");
const { get_currency_rate } = require("../utils/convertUtil");

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
    await new Notification.create({
        owner: req.user._id,
        content: `Fund your new ${currency} wallet now!`,
    })

    // sending back the details of the newly created wallet
    return res.status(201).send(newWallet);
}

exports.get_wallet_balance = async (req, res) => {
    // getting the wallets for the user
    const existingWalletsForUser = await Wallet.find({ owner: req.user._id });
    if (existingWalletsForUser.length < 1) return res.status(200).send([]);

    // mapping the balance for respective wallets
    const balances = existingWalletsForUser.map(wallet => ({
        balance: wallet.balance,
        pendingBalance: wallet.unclearedBalance,
        currency: wallet.currency,
    }))

    return res.status(200).send(balances);
}

exports.fund_wallet = async (req, res) => {
    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);
    
    // checking if the user has a wallet in the requested currency
    const existingWalletOfUser = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (!existingWalletOfUser) return res.status(403).send(`Funding failed. You do not have a ${currency} wallet.`);

    // constructing and validating a transaction object record
    const validNewTransaction = validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'credit', 'Wallet funding', amount, 'pending', currency));
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

    // updating the user's uncleared balance
    existingWalletOfUser.unclearedBalance += amount;
    
    await Promise.all([

        // creating a new transaction record
        Transaction.create(validNewTransaction.value),

        sendEmail(req.user.email, 'Successful Wallet Funding', newFundingMailContent),

        await existingWalletOfUser.save()
    ])

    return res.status(200).send('Wallet funding successful!');
}

exports.transfer_fund = async (req, res) => {
    const { type } = req.params;
    if (!["bank", "wallet"].includes(type)) return res.status(400).send("'type' can only be one of [bank, wallet]");

    if (type === "bank") {
        return res.status(200).send("Working on bank");
    }

    // validating the request body for 'receiverId' and sending back an appropriate error message if any
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).send("'receiverId' required");
    if (!validateMongooseId(receiverId)) return res.status(400).send("Invalid receiver user id passed");
    if (receiverId === req.user._id) return res.status(403).send("You cannot transfer funds from yourself to yourself");

    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    // checking the receiver user exists
    const receivingUser = await User.findById(receiverId);
    if (!receivingUser) return res.status(403).send("Transfer failed. User not found");

    // checking if the user and receiver have a wallet in the requested currency
    const [ existingWalletOfSender, existingWalletOfReceiver ] = await Promise.all([
        Wallet.findOne({ owner: req.user._id, currency: currency }),
        Wallet.findOne({ owner: receiverId, currency: currency })
    ]);
    
    // checking if the sending user has a wallet and sufficient balance in the requested currency
    if (!existingWalletOfSender) return res.status(403).send(`Transfer failed. You do not have a ${currency} wallet.`);
    if (existingWalletOfSender.balance < amount) return res.status(403).send("You do not have sufficient funds to initiate this transfer.");

    // checking if the receiving user has a wallet in the requested currency
    if (!existingWalletOfReceiver) return res.status(403).send(`Transfer failed. Receiver does not have a ${currency} wallet.`);

    // constructing and validating transaction object records for sender and receiver
    const [validNewSenderTransaction, validNewReceiverTransaction] = [
        validateNewTransactionDetails(generateNewTransactionObj(req.user._id, 'transfer', 'Wallet transfer', amount, 'success', currency, receiverId)),
        validateNewTransactionDetails(generateNewTransactionObj(receiverId, 'credit', 'Wallet transfer', amount, 'success', currency)),
    ]
    if (validNewSenderTransaction.error) return res.status(400).send(validNewSenderTransaction.error.details[0].message);
    if (validNewReceiverTransaction.error) return res.status(400).send(validNewReceiverTransaction.error.details[0].message);

    // creating new transaction records for sender and receiver
    await Promise.all([
        Transaction.create(validNewSenderTransaction.value),
        Transaction.create(validNewReceiverTransaction.value)
    ]);
    
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
            content: `You received a transfer of ${currency} ${amount} from ${req.user._id}`,
        })
    ])

    // contructing emails for both sender and receiver
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
    // validating the request body and sending back an appropriate error message if any
    const { errorMsg, amount, currency } = checkWalletRequestBodyErrors(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    // validating the user has a wallet with sufficient balance in the requested currency
    const existingWallet = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (!existingWallet) return res.status(403).send(`Withdrawal failed. You do not have a ${currency} wallet.`);
    if (existingWallet.balance < amount) return res.status(403).send("You do not have sufficient funds to initiate this withdrawal.");

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
        Transaction.create(validNewTransaction.value),

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
        userWalletInInputCurrency -= amount,
        userWalletInOutputCurrency += result.value

        await Promise.all([
            // creating a new transaction
            Transaction.create(validNewTransaction.value),
    
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

        return res.status(200).send(successMessage)
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

exports.clear_wallet_transaction = async (req, res) => {
    // TODO: use CRON to run in background

}