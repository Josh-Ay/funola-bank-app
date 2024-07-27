require('dotenv').config();
const { connectToDb } = require('../config/db');

// making the necessary imports
const express = require('express');
const PORT = process.env.PORT || 5000;

// creating a new express application
const app = express();

// adding routes, external configurations to the application
require('../config/config')(app);


// connecting to the database
connectToDb().then(() => {
    // configuring the application to listen on a dedicated port
    app.listen(PORT, () => {
        console.log('Server up and running on port: ', PORT)
    })
}).catch(err => {
    return { error: 'Failed to connect to DB' }
});