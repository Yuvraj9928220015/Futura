const Popup = require('../models/popupModels');
const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────
// Nodemailer Transporter Setup
// ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

// ─────────────────────────────────────────────
// Email sender helper function
// ─────────────────────────────────────────────
const sendContactEmail = async ({ firstName, lastName, phone, emailAddress, message }) => {
    const mailOptions = {
        from: `"Futura Textiles Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `📩 New Inquiry from ${firstName} ${lastName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                
                <!-- Header -->
                <div style="background-color: #1a1a2e; padding: 24px 32px;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 22px;">
                        📩 New Contact Form Submission
                    </h2>
                    <p style="color: #aaaaaa; margin: 6px 0 0; font-size: 13px;">
                        Futura Textiles Website — Popup Form
                    </p>
                </div>

                <!-- Body -->
                <div style="padding: 28px 32px; background-color: #ffffff;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 140px;">
                                Full Name
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px; font-weight: 600;">
                                ${firstName} ${lastName}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">
                                Phone
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${phone || '—'}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">
                                Email
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${emailAddress
                ? `<a href="mailto:${emailAddress}" style="color: #4a90e2;">${emailAddress}</a>`
                : '—'
            }
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">
                                Message
                            </td>
                            <td style="padding: 10px 0; color: #222; font-size: 15px;">
                                ${message || '—'}
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Footer -->
                <div style="background-color: #f7f7f7; padding: 16px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #aaa;">
                        This email was automatically generated from futuratextiles.in
                    </p>
                </div>

            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

const submitPopup = async (req, res) => {
    try {
        const { name, lastName, phone, emailAddress, message } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'First name is required.' });
        }
        if (!lastName || !lastName.trim()) {
            return res.status(400).json({ success: false, message: 'Last name is required.' });
        }

        // 1. MongoDB mein save karo
        const newEntry = await Popup.create({
            firstName: name.trim(),
            lastName: lastName.trim(),
            phone: phone?.trim() || '',
            emailAddress: emailAddress?.trim() || '',
            message: message?.trim() || '',
        });

        // 2. Email bhejo (DB save ke baad — email fail hone se data save affect na ho)
        try {
            await sendContactEmail({
                firstName: name.trim(),
                lastName: lastName.trim(),
                phone: phone?.trim() || '',
                emailAddress: emailAddress?.trim() || '',
                message: message?.trim() || '',
            });
            console.log('Email sent successfully');
        } catch (emailError) {
            // Email fail ho toh bhi user ko success dikhao
            console.error('❌ Email send failed:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Your message has been submitted successfully!',
            data: newEntry,
        });

    } catch (error) {
        console.error('❌ submitPopup error:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: errors.join(', ') });
        }

        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Get all popup submissions (Admin)
// @route   GET /api/popup/all
// ─────────────────────────────────────────────
const getAllPopups = async (req, res) => {
    try {
        const entries = await Popup.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: entries.length, data: entries });
    } catch (error) {
        console.error('❌ getAllPopups error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Get single popup entry by ID (Admin)
// @route   GET /api/popup/:id
// ─────────────────────────────────────────────
const getPopupById = async (req, res) => {
    try {
        const entry = await Popup.findById(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });
        return res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error('❌ getPopupById error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Update popup entry status (Admin)
// @route   PATCH /api/popup/:id/status
// ─────────────────────────────────────────────
const updatePopupStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['new', 'read', 'replied'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
            });
        }

        const entry = await Popup.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });

        return res.status(200).json({
            success: true,
            message: `Status updated to "${status}".`,
            data: entry,
        });
    } catch (error) {
        console.error('❌ updatePopupStatus error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Delete a popup entry (Admin)
// @route   DELETE /api/popup/:id
// ─────────────────────────────────────────────
const deletePopup = async (req, res) => {
    try {
        const entry = await Popup.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });
        return res.status(200).json({ success: true, message: 'Entry deleted successfully.' });
    } catch (error) {
        console.error('❌ deletePopup error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    submitPopup,
    getAllPopups,
    getPopupById,
    updatePopupStatus,
    deletePopup,
};