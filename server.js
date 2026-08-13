const express = require('express');
const cors = require('cors');

// loading .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { Resend } = require('resend'); // <-- Added Resend package
const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint that receives the device profile from frontend JS
app.post('/api/send-device-info', async (req, res) => {
    const deviceData = req.body;

    try {
        // Format the dictionary nicely into an email body
        const emailBody = JSON.stringify(deviceData, null, 2);

        // Send via Resend HTTP API (works smoothly on Render!)
        await resend.emails.send({
            from: 'Website Tracker <onboarding@resend.dev>', // Use Resend's default sender for testing
            to: [process.env.RESEND_EMAIL], // just for rec
            subject: 'New Visitor Device Info Collected',
            text: `Here is the device profile collected:\n\n${emailBody}`
        });

        res.status(200).json({ success: true, message: 'Email sent successfully via Resend' });
    } catch (error) {
        console.error('Resend Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});