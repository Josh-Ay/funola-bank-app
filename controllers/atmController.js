const { validateNewATM, ATM } = require("../models/atms")

exports.add_new_atm_entry = async (req, res) => {
    const { error, value } = validateNewATM(req.body);

    // validating the request body and sending back an appropriate error message if any
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const atmExists = await ATM.findOne({ name: value.name, distance: value.distance }).lean();
        if (atmExists) return res.status(409).send('ATM already added')
    } catch (error) {
        console.log('error validating new ATM: ', error);
        return res.status(500).send('An error occurred while trying to add your new atm entry');
    }

    try {
        // creating a new atm entry
        const newATM = await ATM.create(value);
        return res.status(201).send(newATM);
    } catch (error) {
        // sending back an appropriate error message if any
        console.log('error creating ATM: ', error);
        return res.status(500).send('An error occurred while trying to add your new atm entry');
    }
}

exports.get_nearby_atms = async (req, res) => {
    try {
        // finding the closest 10 atms within a 500m radius
        const atms = await ATM.find({ distance: { $lte: 500 } }).sort({ distance: 1 }).limit(10).lean();
        return res.status(200).send(atms);
    } catch (error) {
        // sending back an appropriate error message if any
        console.log('error fetching nearby ATMs: ', error);
        return res.status(500).send('An error occurred while trying to get atms close to you');
    }
}

exports.find_atms_within_distance = async (req, res) => {
    const { distance } = req.body;

    // validating the request body and sending back an appropriate error message if any
    if (!distance) return res.status(400).send("'distance' required");
    if (isNaN(Number(distance))) return res.status(400).send("'distance' must be a number");

    try {
        // finding the closest 10 atms within a 500m radius
        const atms = await ATM.find({ distance: { $lte: distance } }).sort({ distance: 1 }).limit(30).lean();
        return res.status(200).send(atms);
    } catch (error) {
        // sending back an appropriate error message if any
        console.log('error fetching custom distance ATMs: ', error);
        return res.status(500).send('An error occurred while trying to get atms within distance passed');
    }
}
