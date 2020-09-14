const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pagebound.bootcamp@gmail.com',
        pass: process.env.GMAIL_PASSWORD }
});

module.exports = transporter;