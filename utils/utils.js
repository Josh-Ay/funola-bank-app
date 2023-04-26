require('dotenv').config();

const nodemailer = require('nodemailer');
const Handlebars = require("handlebars");
const { verificationMailHtmlContent } = require('../templates/verificationEmailTemplate');
const jwt = require('jsonwebtoken');
const { resetPasswordHtmlContent } = require('../templates/resetEmailTemplate');
const { successPasswordChangeHtmlContent } = require('../templates/successPasswordChangeTemplate');

exports.sendSms = async (number, message) => {
    /**
     * Sends a text to a phone number using twilio.
     * 
     * @param number The phone number of the receiving user.
     * @param message The text message you will like to send.
     * 
     * @returns null.
     */
    
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    const response = await client.messages.create({
        body: message,
        from: '+16204558982',
        to: number
    })
        
    // console.log(response);
}

exports.sendEmail = async (receiver, subject, htmlTemplate) => {
    /**
     * Sends an email to an email address.
     * 
     * @param receiver The email address of the receiving user.
     * @param subject The subject of the email.
     * @param htmlTemplate The html content/template you are sending as the body of the email.
     * 
     * @returns An object with one property: 'success' or 'error' depending on the mail dispatch status.
     */

    // configuring the mail transport instance
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_MAIL,
          pass: process.env.ADMIN_MAIL_PASSWORD,
        }
    });
    
    // mailing options
    const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: receiver,
        subject: subject,
        html: htmlTemplate,
    };

    try {
        const res = await transporter.sendMail(mailOptions);
        console.log('Email sent to: ' + receiver);
        return { success: res.response }       
    } catch (error) {
        console.log('error: ', error);
        return { error: error };
    }
} 

exports.compileHtml = (title, content, type) => {
    /**
     * Uses handlebars to compile a js file into html.
     * 
     * @param title The title you will like to display on the html file.
     * @param content The content of the html file.
     * @param type The type of js file you are looking to compile
     * 
     * @returns A handlebar template.
     */

    let template;
    switch (type) {
        case 'verificationMail':
            template = Handlebars.compile(verificationMailHtmlContent);
            return template({ 
                title: title, 
                content: content 
            });
        case 'resetPasswordMail':
            template = Handlebars.compile(resetPasswordHtmlContent);
            return template({ 
                title: title, 
                content: content 
            });
        case 'passwordChange':
            template = Handlebars.compile(successPasswordChangeHtmlContent);
            return template({
                title: title,
            })
        default:
            console.log('Invalid type passed');
            return ''
    }
}

exports.generateToken = async (plainObj, tokenType) => {
    /**
     * Generates a jwt token of a javascript object using stored secrets.
     * 
     * @param plainObj The javascript object you will like to validate.
     * @param tokenType The type of token you are generating. It can only be one of 'access', 'verification', 'refresh', 'reset'.
     * 
     * @returns A new jwt token.
     */

    const validTokenTypes = ['access', 'verification', 'refresh', 'reset'];
    if (!validTokenTypes.includes(tokenType)) throw Error("'tokenType' must be one of 'access', 'verification', 'refresh', 'reset'");

    return await jwt.sign(
        plainObj, 
        tokenType === 'access' ? 
            process.env.ACCESS_TOKEN_SECRET :
        tokenType === 'verification' ?
            process.env.VERIFICATION_TOKEN_SECRET :
        tokenType === 'reset' ?
            process.env.RESET_TOKEN_SECRET :
            process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: tokenType === 'verification' || tokenType === 'reset' ? '2h' : '7d'
        },
    );
}

exports.validateToken = (token, tokenType) => {
    /**
     * Validates a jwt token using stored secrets.
     * 
     * @param token The jwt token you will like to validate.
     * @param tokenType The type of token you are generating. It can only be one of 'access', 'verification', 'refresh', 'reset'.
     * 
     * @returns False or The decoded jwt token.
     */

    const validTokenTypes = ['access', 'verification', 'refresh', 'reset'];
    if (!validTokenTypes.includes(tokenType)) return false;

    try {
        // validating the jwt token passed against the token secret
        const validToken = jwt.verify(
            token, 
            tokenType === 'access' ? 
                process.env.ACCESS_TOKEN_SECRET :
            tokenType === 'verification' ?
                process.env.VERIFICATION_TOKEN_SECRET :
            tokenType === 'reset' ?
                process.env.RESET_TOKEN_SECRET :
            process.env.REFRESH_TOKEN_SECRET,
        );
        return validToken;
    } catch (error) {
        return false
    }
}