const Receive = require('../models/receiveModels');  // ✅ receiveModels (with s)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// POST /api/receive/subscribe
const subscribeUser = async (req, res) => {
    try {
        const { firstName, lastName, emailAddress } = req.body;

        if (!firstName || !lastName || !emailAddress) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            return res.status(400).json({
                success: false,
                message: 'Valid email address enter karo.'
            });
        }

        const existing = await Receive.findOne({ emailAddress });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Yeh email already subscribed hai.'
            });
        }

        const newUser = new Receive({ firstName, lastName, emailAddress });
        await newUser.save();

        await transporter.sendMail({
            from: `"Futura Textiles" <${process.env.EMAIL_USER}>`,
            to: 'yuvrajsharma10105@gmail.com',
            subject: '📬 New Newsletter Subscriber - Futura Textiles',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 580px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #4a5568; padding: 24px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0;">Futura Textiles</h2>
                        <p style="color: #cbd5e0; margin: 6px 0 0;">New Newsletter Subscriber</p>
                    </div>
                    <div style="padding: 30px;">
                        <p style="color: #555; font-size: 15px;">Ek nayi subscription aayi hai:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                            <tr style="background: #f9f9f9;">
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; font-weight: bold; color: #4a5568; width: 40%;">First Name</td>
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #333;">${firstName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Last Name</td>
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #333;">${lastName}</td>
                            </tr>
                            <tr style="background: #f9f9f9;">
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Email Address</td>
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #333;">${emailAddress}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; font-weight: bold; color: #4a5568;">Subscribed At</td>
                                <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #333;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
                            </tr>
                        </table>
                    </div>
                    <div style="background: #f7f7f7; padding: 16px; text-align: center; font-size: 12px; color: #aaa;">
                        © 2025 Futura Textiles — Automated Notification
                    </div>
                </div>
            `
        });

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed!'
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

module.exports = { subscribeUser };