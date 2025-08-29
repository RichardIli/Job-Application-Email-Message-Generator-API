// routes/routes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { composeEmail } = require('../controller/email_compose_by_gemini.js');
const { sendEmail } = require('../controller/sendEmail.js');



// Set up multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Store the file in memory as a buffer

// Use the upload middleware for your route
// 'jobDetailsFile' is the name of the input field in your HTML form
router.post('/compose-email', upload.single('jobDetailsFile'), composeEmail);

// Send the email after cheking the email content
router.post('/sendEmail', sendEmail);

module.exports = router;