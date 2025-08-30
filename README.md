# Gen-AI Powered Email Application

This project is a back-end application that leverages Google's Gemini API to automate the process of composing job application emails. It can extract job details from various file types, including PDFs, images, and Word documents, and then use that information, along with a predefined CV, to generate a professional, ready-to-send email.

-----

## Features

  * **Intelligent Email Composition**: Uses the Gemini API to compose professional job application emails based on job descriptions and your CV.
  * **Multi-format Support**: Extracts text from PDFs, images (using OCR), and Word (.docx) files.
  * **CV Integration**: Automatically includes a predefined CV as an email attachment.
  * **Nodemailer Integration**: Handles email sending using Nodemailer.
  * **Robust API Endpoints**: Provides dedicated endpoints for composing and sending emails.
  * **Structured Output**: Ensures the generated email content is a valid JSON object, making it easy to parse and use.

-----

## Prerequisites

Before you begin, ensure you have the following installed:

  * Node.js
  * A Google Gemini API key
  * An email service account (e.g., Gmail, Outlook)

-----

## Getting Started

### 1\. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository_url>
cd <project_directory>
npm install
```

### 2\. Configuration

Create a `.env` file in the root directory and add the following environment variables:

```
API_KEY="YOUR_GEMINI_API_KEY"
EMAIL_SERVICE="YOUR_EMAIL_SERVICE_PROVIDER" # e.g., 'gmail'
EMAIL_USER="YOUR_EMAIL_ADDRESS"
EMAIL_PASS="YOUR_EMAIL_PASSWORD"
PORT=3000
```

  * **`API_KEY`**: Your Google Gemini API key.
  * **`EMAIL_SERVICE`**: Your email service provider (e.g., `gmail`).
  * **`EMAIL_USER`**: The email address you will use to send the applications.
  * **`EMAIL_PASS`**: The password for your email account. If you're using a service like Gmail, you may need to use an "App Password" rather than your regular password.

### 3\. Placing Your CV

Place your CV file in the `assets` folder. The application is configured to look for a file named `Richard_R._Ili_CV.pdf`. You can either rename your CV to match this or update the `myCVPath` constant in `controller/email_compose_by_gemini.js` to point to your file.

```javascript
// in controller/email_compose_by_gemini.js
const myCVPath = path.join(__dirname, '../../assets/your_cv_name.pdf');
```

-----

## API Endpoints

The application exposes the following API endpoints:

### `POST /api/compose-email`

This endpoint generates a job application email. It can accept either plain text job details or a file upload.

  * **Request Body (Option 1: Plain Text)**

      * `jobDetails` (string, required): The job description in plain text.
      * `notes` (string, optional): Any additional notes or instructions for the AI.

  * **Request Body (Option 2: File Upload)**

      * `jobDetailsFile` (file, required): The job description as a file. Supported types are PDF (`.pdf`), image (`.png`, `.jpeg`, `.jpg`), and Word (`.docx`).
      * `notes` (string, optional): Any additional notes or instructions for the AI.

  * **Response**

    Returns a JSON object containing the composed email details.

    ```json
    {
      "to": "<email retreived from jobDetails>",
      "subject": "<ai generated Subject based on the jobDetails>",
      "text": "<composed email body in plain text>",
      "actionNeeded": "<call to action or a field to manually fill>"
    }
    ```

### `POST /api/sendEmail`

This endpoint sends the email composed by the `/compose-email` endpoint.

  * **Request Body**

      * `to` (string, required): The recipient's email address.
      * `subject` (string, required): The email subject.
      * `text` (string, required): The plain text body of the email.
      * `html` (string, optional): The HTML body of the email.

  * **Response**

    Returns a success message upon successful email delivery.

    ```json
    "Email sent successfully!"
    ```

-----

## Dependencies

  * `express`: Web framework for Node.js.
  * `cors`: Provides a middleware to enable cross-origin resource sharing.
  * `body-parser`: Parses incoming request bodies.
  * `multer`: Middleware for handling `multipart/form-data`, used for file uploads.
  * `@google/generative-ai`: Google's official client library for the Gemini API.
  * `pdf-parse`: A utility to extract text from PDFs.
  * `tesseract.js`: A pure JavaScript OCR library for text recognition from images.
  * `mammoth`: Converts `.docx` files to plain text.
  * `nodemailer`: A module for sending emails from Node.js applications.
  * `dotenv`: Loads environment variables from a `.env` file.