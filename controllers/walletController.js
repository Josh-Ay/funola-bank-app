const { Wallet } = require('../models/wallet');

exports.create_wallet = async (req, res) => {
    // validating the request body and send back an appropriate error message if any
    const { currency } = req.body;
    if (!currency) return  res.status(400).send("'currency' required");
    if (!['NGN', 'USD'].includes(currency)) return res.status(400).send("'currency' can only be one of 'NGN', 'USD'");

    // checking if the user already has a wallet in the requested currency
    const existingWalletOfUser = await Wallet.findOne({ owner: req.user._id, currency: currency });
    if (existingWalletOfUser) return res.status(409).send(`User already has a ${currency} wallet.`);

    // creating a new wallet for the user
    const newWallet = await Wallet.create({
        owner: req.user._id,
        currency: currency,
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

}

exports.transfer_fund = async (req, res) => {

}

exports.withdraw_from_wallet = async (req, res) => {

}
