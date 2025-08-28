const nodemailer = require('nodemailer');

// --- Nodemailer Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify the transporter connection. This is a good practice.
// Note: We don't need to export this, it just runs once when the module is required.
transporter.verify((error, success) => {
    if (error) {
        console.error("Error verifying Nodemailer transporter:", error);
    } else {
        console.log("Nodemailer service is ready to send messages. Connection verified.");
    }
});

/**
 * Sends an email using the pre-configured Nodemailer transporter.
 * @param {object} mailOptions - The email options (to, subject, text, html).
 * @returns {Promise<object>} A promise that resolves with the email information object.
 */
exports.sendEmail = async (mailOptions) => {
    try {
        if (!mailOptions.to || !mailOptions.subject || (!mailOptions.text && !mailOptions.html)) {
            throw new Error("Missing required email fields: to, subject, and either text or html.");
        }

        const info = await transporter.sendMail({
            ...mailOptions,
            from: process.env.EMAIL_USER, // Set the 'from' address from your env variables
        });

        console.log("Message sent: %s", info.messageId);
        // Returns the info object from Nodemailer
        return info;

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email. " + error.message);
    }
};
