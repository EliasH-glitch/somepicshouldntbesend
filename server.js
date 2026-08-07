const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.yourmailserver.com', // e.g., smtp.gmail.com
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password'
    }
});

// Endpoint that receives the device profile from frontend JS
app.post('/api/send-device-info', async (req, res) => {
    const deviceData = req.body;

    try {
        // Format the dictionary nicely into an email body
        const emailBody = JSON.stringify(deviceData, null, 2);

        await transporter.sendMail({
            from: '"Website Tracker" <your-email@example.com>',
            to: 'destination-inbox@example.com',
            subject: 'New Visitor Device Info Collected',
            text: `Here is the device profile collected:\n\n${emailBody}`
        });

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('SMTP Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Backend server running on port 3000');
});