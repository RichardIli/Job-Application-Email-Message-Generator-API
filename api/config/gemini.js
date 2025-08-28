const { GoogleGenerativeAI } = require('@google/generative-ai');

const api_Key = process.env.API_KEY;
if (!api_Key) {
    console.error('API_KEY is not defined in environment variables.');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(api_Key);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: "application/json" },
});

module.exports = model;