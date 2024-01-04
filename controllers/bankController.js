const { Bank, validateBankDetails } = require("../models/banks");

exports.get_banks = async (req, res) => {
    try {
        // fetching banks the user has saved
        const banksForUser = await Bank.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();
        return res.status(200).send(banksForUser);
    } catch (error) {
        // sending back an appropriate error message if any
        return res.status(500).send('An error occurred while trying to fetch banks for user');
    }
}

exports.add_new_bank = async (req, res) => {
    // validating request body and sending back appropriate error messages if any
    const { value, error } = validateBankDetails({ owner: req.user._id, ...req.body });
    if (error) return res.status(400).send(error.details[0].message);
    if (isNaN(value.accountNumber)) return res.status(400).send("'accountNumber' must be a number");

    try {
        // checking if the user has added the bank account before and returning a message if so
        const bankAccountAlreadyAdded = await Bank.findOne({ owner: req.user._id, accountNumber: value.accountNumber }).lean();
        if (bankAccountAlreadyAdded) return res.status(400).send("You already have an account with this account number");
    } catch (error) {
        // sending back an appropriate error message if any
        return res.status(500).send('An error occurred while trying to add new bank for user');
    }

    try {
        // creating a new bank entry for the user
        const newBank = await Bank.create(value);
        return res.status(201).send(newBank);
    } catch (error) {
        // sending back an appropriate error message if any
        return res.status(500).send('An error occurred while trying to add new bank for user');
    }
}

exports.update_bank_detail = async (req, res) => {
    const { id } = req.params;

    // validating request body and sending back appropriate error messages if any
    const { value, error } = validateBankDetails(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);
    if (isNaN(value.accountNumber)) return res.status(400).send("'accountNumber' must be a number");

    let foundBank;

    try {
        // checking for a matching bank for the current user
        foundBank = await Bank.findOne({ owner: req.user._id, _id: id });
        if (!foundBank) return res.status(404).send('Bank account not found');    
    } catch (error) {
        // sending back an appropriate error message if any
        return res.status(500).send('An error occurred while trying to update bank detail for user');
    }

    // updating the found bank account details
    foundBank.accountNumber = value.accountNumber;
    foundBank.name = value.name;
    foundBank.type = value.type;

    try {
        // saving the updated details to the db
        await foundBank.save();
        return res.status(200).send(foundBank);
    } catch (error) {
        // sending back an appropriate error message if any
        return res.status(500).send('An error occurred while trying to update bank detail for user');
    }
}

exports.delete_bank = async (req, res) => {
    const { id } = req.params;

    try {
        // deleting matching bank for the current user
        const deletedBankRes = await Bank.deleteOne({ owner: req.user._id, _id: id });
        if (deletedBankRes?.deletedCount === 0) return res.status(404).send('Bank account not found');

        return res.status(200).send('Bank account successfully deleted');
    } catch (error) {
        // sending back an appropriate error message if any
        return res.status(500).send('An error occurred while trying to delete bank detail for user');
    }
}