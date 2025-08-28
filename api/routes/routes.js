// routes/routes.js
const express = require('express');
const router = express.Router();
const { composeEmail } = require('../controller/email_compose_by_gemini.js');
const { sendEmail } = require('../controller/sendEmail.js');

// Use the upload middleware for your route
// 'jobDetailsFile' is the name of the input field in your HTML form
app.post('/compose-email', upload.single('jobDetailsFile'), composeEmail);

// Send the email after cheking the email content
router.post('/sendEmail', sendEmail);

module.exports = router;