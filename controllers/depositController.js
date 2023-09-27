const { validateNewDepositDetails, Deposit } = require("../models/deposits")
const { Wallet } = require("../models/wallet");
const { Card } = require("../models/cards");
const { compileHtml, sendEmail } = require("../utils/emailUtils");
const { formatDateAndTime } = require("../utils/dateUtil");

exports.get_deposits = async (req, res) => {
    // getting the first 50 deposits for the current user
    const deposits = await Deposit.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(50).lean();

    return res.status(200).send(deposits);
}

exports.make_new_deposit = async (req, res) => {
    // checking the user has verified account
    if (!req.user.accountVerified) return res.status(401).send('Kindly verify your account first');

    // validating the keys of the request body
    const validNewDeposit = validateNewDepositDetails({ owner: req.user._id, ...req.body });
    if (validNewDeposit.error) return res.status(400).send(validNewDeposit.error.details[0].message);

    // validating numeric inputs
    if (isNaN(Number(validNewDeposit.value.depositAmount))) return res.status(400).send("'depositAmount' must be a number");
    if (isNaN(Number(validNewDeposit.value.duration))) return res.status(400).send("'duration' must be a number");
    if (isNaN(Number(validNewDeposit.value.rate))) return res.status(400).send("'rate' must be a number");
    
    // validating the range of values of numeric inputs
    if (Number(validNewDeposit.value.depositAmount) <= 0) return res.status(400).send("Deposit amount must be greater than 0");
    if (Number(validNewDeposit.value.duration) < 0 || Number(validNewDeposit.value.duration) > 12) return res.status(400).send("Duration must be between 1 to 12");
    if (Number(validNewDeposit.value.rate) < 0 || Number(validNewDeposit.value.rate) > 25) return res.status(400).send("Rate must be between 1 and 25");

    let userItemToDeductFrom = {};

    // payment via card
    if (validNewDeposit.value.paymentMethod === 'card') {
        // validating the user has an appropriate card to fund the deposit
        const userCardInPassedCurrency = await Card.findOne({ owner: req.user._id, currency: validNewDeposit.value.currency });
        if (!userCardInPassedCurrency) return res.status(403).send(`Deposit cannot be made because user does not have a ${validNewDeposit.value.currency} card.`)

        // checking the user has enough funds to make a deposit
        if (userCardInPassedCurrency.balance < Number(validNewDeposit.value.depositAmount)) return res.status(403).send('Insufficient funds!');
 
        userItemToDeductFrom = userCardInPassedCurrency;
    } 

    // payment via wallet
    if (validNewDeposit.value.paymentMethod === 'wallet') {
        // validating the user has an appropriate wallet to fund the deposit
        const userWalletInPassedCurrency = await Wallet.findOne({ owner: req.user._id, currency: validNewDeposit.value.currency });
        if (!userWalletInPassedCurrency) return res.status(403).send(`Deposit cannot be made because user does not have a ${validNewDeposit.value.currency} wallet.`)
    
        // checking the user has enough funds to make a deposit
        if (userWalletInPassedCurrency.balance < Number(validNewDeposit.value.depositAmount)) return res.status(403).send('Insufficient funds!');
 
        userItemToDeductFrom = userWalletInPassedCurrency;
    }

    // additional check
    if (Object.keys(userItemToDeductFrom).length < 1 || !userItemToDeductFrom.balance) return res.status(500).send("Card or Wallet details failed to fetch");
    
    // constructing the new deposit record
    const newDeposit = {
        ...validNewDeposit.value,
        paybackDate: new Date(new Date().getTime() + validNewDeposit.value.duration * 30 * 24 * 60 * 60 * 1000 ), // the duration passed is in months
        paybackAmount: Number(validNewDeposit.value.depositAmount) + Number( ((validNewDeposit.value.rate / 100) / validNewDeposit.value.duration) * validNewDeposit.value.depositAmount ),
    }

    // updating the user's balance
    userItemToDeductFrom.balance -= validNewDeposit.value.depositAmount;

    // compiling the email to send to the user notifying of the deposit made
    const newDepositMailContent = compileHtml(
        `${req.user.firstName} ${req.user.lastName}`, 
        'New Deposit!', 
        { 
            currency: validNewDeposit.value.currency, 
            amount: validNewDeposit.value.depositAmount, 
            rate: validNewDeposit.value.rate, 
            returns: newDeposit.paybackAmount, 
            paybackDate: formatDateAndTime(newDeposit.paybackDate)
        },
        'newDeposit'
    );

    const [depositCreated, updateResponse, emailResponse] = await Promise.all([
        // creating a new deposit in db
        Deposit.create(newDeposit),

        // saving the update to the wallet/card used
        userItemToDeductFrom?.save(),

        // sending an email to the user
        sendEmail(req.user.email, `You successfully made a deposit of ${validNewDeposit.value.currency} ${validNewDeposit.value.depositAmount}`, newDepositMailContent),
    ])

    return res.status(201).send(depositCreated);
}