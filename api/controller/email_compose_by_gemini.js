const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const mammoth = require('mammoth');
const model = require('../config/gemini.js');

// Helper to call Gemini API and parse JSON
async function getComposedEmail(prompt) {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    try {
        return JSON.parse(responseText);
    } catch (err) {
        throw new SyntaxError(`Failed to parse JSON response: ${err.message}. Raw response: ${responseText}`);
    }
}

// Helper to extract text from a PDF file
async function extractTextFromPDF(buffer) {
    const data = await pdf(buffer);
    return data.text;
}

// Helper to extract text from an image file using OCR
async function extractTextFromImage(buffer) {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    return text;
}

// Helper to extract text from a Word (.docx) file
async function extractTextFromDocx(buffer) {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value; // The raw text
}

const composedEmailSample = {
    "to": "<email retreived from jobDetails>",
    "subject": "<ai generated Subject based on the jobDetails>",
    "text": "<composed email body in plain text>",
    "html": "<leave it blank or just dont generate this field>",
    "actionNeeded": "<write a call to action like need to manualy fill a specific field on the generated text email body>"
};

exports.composeEmail = async (req, res) => {
    try {
        const { jobDetails, notes } = req.body;
        const uploadedFile = req.file; // Assumes multer middleware is used

        if (!jobDetails && !uploadedFile) {
            return res.status(400).json({ error: "Missing job details or file upload" });
        }

        let jobDetailsContent = '';

        if (uploadedFile) {
            // Determine file type and extract content
            switch (uploadedFile.mimetype) {
                case 'application/pdf':
                    console.log('Processing PDF file.');
                    jobDetailsContent = await extractTextFromPDF(uploadedFile.buffer);
                    break;
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                    console.log('Processing image file using OCR.');
                    jobDetailsContent = await extractTextFromImage(uploadedFile.buffer);
                    break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // .docx MIME type
                    console.log('Processing Word (.docx) file.');
                    jobDetailsContent = await extractTextFromDocx(uploadedFile.buffer);
                    break;
                default:
                    return res.status(400).json({ error: "Unsupported file type" });
            }

            // Create a prompt to summarize the extracted details
            const extractedDetailsPrompt = `Extract the most important details (job title, company, key responsibilities, qualifications, and any contact info) from the following job description text and return it as a single block of plain text.

            **Job Description Text:**
            ${jobDetailsContent}`;

            const result = await model.generateContent(extractedDetailsPrompt);
            jobDetailsContent = result.response.text();

        } else {
            // If it's plain text, use it directly
            jobDetailsContent = jobDetails;
            console.log('Processing plain text job details.');
        }

        // Path to your CV file. Make sure this path is correct.
        const myCVPath = path.join(__dirname, '../../assets/Richard_R._Ili_CV.pdf');
        const myCVContent = await extractTextFromPDF(fs.readFileSync(myCVPath));

        const emailPrompt = `Compose a professional job application email based on the following information. The output must be a valid JSON object.

        **Job Details:**
        ${jobDetailsContent}

        **My CV Content:**
        ${myCVContent}

        **Additional Notes:**
        ${notes || 'N/A'}

        Keep the email concise and to the point. The output structure must exactly match the following JSON schema. The "html" field should be left blank or omitted.

        ${JSON.stringify(composedEmailSample, null, 2)}`;

        const emailResponse = await getComposedEmail(emailPrompt);

        res.status(200).json(emailResponse);

    } catch (error) {
        console.error('Error composing email:', error);
        res.status(500).json({ error: error.message });
    }
};