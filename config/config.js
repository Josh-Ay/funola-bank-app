const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const express = require('express');

module.exports = (app) => {
    // using morgan to log request details
    app.use(morgan('combined'));

    app.use(express.json())

    // adding all the routes of the application
    require('../routes/index')(app);

    // connecting to the database
    mongoose.connect(process.env.MONGO_DB_URI).then(() => {
        console.log('Connected to DB')
    }).catch((err) => {
        console.log('Failed to connect to DB: ', err);
    });
}