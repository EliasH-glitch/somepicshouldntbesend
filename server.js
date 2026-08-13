const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // <-- Fixed: Added nodemailer import
const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Configure your SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.com',
    port: 587, 
    secure: false, 
    auth: {
        user: 'randommail74@seznam.cz', 
        pass: 'R@nd0mm@1l.74.'
    }
});

// Single, clean endpoint that receives the device profile and sends an email
app.post('/api/send-device-info', async (req, res) => {
    const deviceData = req.body;

    try {
        // Format the dictionary nicely into an email body
        const emailBody = JSON.stringify(deviceData, null, 2);

        await transporter.sendMail({
            from: '"Website Tracker" <your-email@example.com>',
            to: 'sweetsweetdata@tutamail.com',
            subject: 'New Visitor Device Info Collected',
            text: `Here is the device profile collected:\n\n${emailBody}`
        });

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('SMTP Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Use Render's assigned port dynamically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});