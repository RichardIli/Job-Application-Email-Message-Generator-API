const path = require('path');
const { sendEmail } = require('../services/emailServices.js');

exports.sendEmail = async (req, res) => {
    const { to, subject, text, html } = req.body;

    // Define the file name and the path to the file
    const attachmentFileName = 'Richard_R._Ili_CV.pdf'; // Replace with your file name
    const attachmentPath = path.join(__dirname, '..', '..', 'assets', attachmentFileName); // Adjust the path as needed

    try {
        if (!to || !subject || !text) {
            return res.status(400).send({ error: "Missing required fields: to, subject, and either text or html." });
        }

        const mailOptions = {
            to,
            subject,
            text,
            html,
            attachments: [
                {
                    filename: attachmentFileName,
                    path: attachmentPath
                }
            ]
        };

        await sendEmail(mailOptions);

        res.status(200).send("Email sent successfully!");

    } catch (error) {
        console.error('Error in /sendEmail route:', error);
        res.status(500).send({ error: "Failed to send email.", message: error.message });
    }
};