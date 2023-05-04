const { default: mongoose } = require("mongoose");

exports.connectToDb = async () => {
    // connecting to the database
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);   
        console.log('Connected to DB')
    } catch (error) {
        console.log('Failed to connect to DB: ', error);
    }
}