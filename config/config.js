const morgan = require("morgan");
const express = require('express');
const { connectToDb } = require("./db");
const compression = require("compression");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
    // using morgan to log request details
    app.use(morgan('combined'));

    app.use(express.json());
    app.use(cookieParser(process.env.COOKIE_SECRET));

    // compressing the API responses
    app.use(compression());

    // adding all the routes of the application
    require('../routes/index')(app);

    // connecting to the database
    connectToDb();
}