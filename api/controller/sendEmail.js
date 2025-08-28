const express = require('express');
const app = express();
require('dotenv').config();
const { sendEmail } = require('../services/emailServices.js');

exports.sendEmail = async (req, res) => {
    const { to, subject, text, html } = req.body;

    try {
        // You can add validation here or inside the email service module
        if (!to || !subject || (!text && !html)) {
            return res.status(400).send({ error: "Missing required fields: to, subject, and either text or html." });
        }

        const mailOptions = { to, subject, text, html };

        // Use the imported function to send the email
        await sendEmail(mailOptions);

        res.status(200).send("Email sent successfully!");

    } catch (error) {
        // The sendEmail function will throw a more descriptive error
        console.error('Error in /sendEmail route:', error);
        res.status(500).send({ error: "Failed to send email.", message: error.message });
    }
};
