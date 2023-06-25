const nodemailer = require('nodemailer');
const Handlebars = require("handlebars");
const { verificationMailHtmlContent } = require('../templates/emailActionTemplates/verificationEmailTemplate');
const { resetPasswordHtmlContent } = require('../templates/emailActionTemplates/resetEmailTemplate');
const { successPasswordChangeHtmlContent } = require('../templates/passwordActionTemplates/successPasswordChangeTemplate');
const { emailChangeHtmlContent } = require('../templates/emailActionTemplates/emailChangeTemplate');
const { newDepositTemplate } = require('../templates/cashFlowTemplates/newDepositTemplate');
const { newFundingTemplate } = require('../templates/cashFlowTemplates/newFundingTemplate');
const { newDebitTemplate } = require('../templates/cashFlowTemplates/newDebitTemplate');
const { newSwapTemplate } = require('../templates/cashFlowTemplates/newSwapTemplate');

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
        console.log('error sending mail: ', error);
        return { error: error };
    }
} 

exports.compileHtml = (nameOfUser, title, content, type, cashFlowType='') => {
    /**
     * Uses handlebars to compile a js file into html.
     * 
     * @param nameOfUser The name of the user you will like to send the email to.
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
                content: content,
                name: nameOfUser,
            });
        case 'resetPasswordMail':
            template = Handlebars.compile(resetPasswordHtmlContent);
            return template({ 
                title: title, 
                content: content,
                name: nameOfUser,
            });
        case 'passwordChange':
            template = Handlebars.compile(successPasswordChangeHtmlContent);
            return template({
                title: title,
                name: nameOfUser,
            })
        case 'emailChange':
            template = Handlebars.compile(emailChangeHtmlContent);
            return template({
                title: title,
                name: nameOfUser,
                content: content,
            })
        case 'newDeposit':
            template = Handlebars.compile(newDepositTemplate);
            return template({
                title: title,
                name: nameOfUser,
                content: content
            })
        case 'newFunding':
            template = Handlebars.compile(newFundingTemplate);
            return template({
                title: title,
                name: nameOfUser,
                content: content,
                fundingType: cashFlowType,
            })
        case 'debit':
            template = Handlebars.compile(newDebitTemplate);
            return template({
                title: title,
                name: nameOfUser,
                content: content,
                debitType: cashFlowType,
            })
        case 'swap':
            template = Handlebars.compile(newSwapTemplate);
            return template({
                title: title,
                name: nameOfUser,
                content: content,
            })
        default:
            console.log('Invalid type passed');
            return '<div></div>'
    }
}
