const Contact = require('../models/contactModels');
const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────
// Nodemailer Transporter
// ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─────────────────────────────────────────────
// Email Helper Function
// ─────────────────────────────────────────────
const sendEnquiryEmail = async (data) => {
    const {
        title, firstName, lastName, email, phone,
        preferredLanguage, natureOfEnquiry, country,
        subject, details, receiveUpdates, agreeToPrivacy
    } = data;

    const mailOptions = {
        from: `"Futura Textiles Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `📩 New Enquiry: ${subject} — ${firstName} ${lastName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 640px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">

                <!-- Header -->
                <div style="background-color: #1a1a2e; padding: 24px 32px;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📩 New Contact Enquiry</h2>
                    <p style="color: #aaaaaa; margin: 6px 0 0; font-size: 13px;">
                        Futura Textiles Website — Contact Form
                    </p>
                </div>

                <!-- Body -->
                <div style="padding: 28px 32px; background-color: #ffffff;">
                    <table style="width: 100%; border-collapse: collapse;">

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 170px;">Full Name</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px; font-weight: 600;">
                                ${title} ${firstName} ${lastName}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Email</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                <a href="mailto:${email}" style="color: #4a90e2;">${email}</a>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Phone</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${phone || '—'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Country</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${country || '—'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Preferred Language</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${preferredLanguage || '—'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Nature of Enquiry</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${natureOfEnquiry || '—'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Subject</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px; font-weight: 600;">
                                ${subject || '—'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; vertical-align: top;">Details</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px; line-height: 1.6;">
                                ${details || '—'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">Receive Updates</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #222; font-size: 15px;">
                                ${receiveUpdates ? 'Yes' : '❌ No'}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 10px 0; color: #888; font-size: 13px;">Agreed to Privacy</td>
                            <td style="padding: 10px 0; color: #222; font-size: 15px;">
                                ${agreeToPrivacy ? 'Yes' : '❌ No'}
                            </td>
                        </tr>

                    </table>
                </div>

                <!-- Footer -->
                <div style="background-color: #f7f7f7; padding: 16px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #aaa;">
                        This email was automatically generated from futuratextiles.in — Contact Page
                    </p>
                </div>

            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// ─────────────────────────────────────────────
// @desc    Submit contact enquiry (Public)
// @route   POST /api/contact/submit
// ─────────────────────────────────────────────
const submitEnquiry = async (req, res) => {
    try {
        const {
            title, firstName, lastName, email, phone,
            preferredLanguage, natureOfEnquiry, country,
            subject, details, receiveUpdates, agreeToPrivacy
        } = req.body;

        // Validation
        if (!title || !firstName || !lastName || !email || !phone || !natureOfEnquiry || !subject || !details) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields.'
            });
        }

        // 1. MongoDB mein save karo
        const newContact = await Contact.create({
            title,
            firstName,
            lastName,
            email,
            phone,
            preferredLanguage,
            natureOfEnquiry,
            country,
            subject,
            details,
            receiveUpdates: receiveUpdates || false,
            agreeToPrivacy: agreeToPrivacy || false
        });

        // 2. Email bhejo (save ke baad — email fail se data affect na ho)
        try {
            await sendEnquiryEmail({
                title, firstName, lastName, email, phone,
                preferredLanguage, natureOfEnquiry, country,
                subject, details, receiveUpdates, agreeToPrivacy
            });
            console.log('Contact enquiry email sent successfully');
        } catch (emailError) {
            console.error('❌ Email send failed:', emailError.message);
            // Email fail ho toh bhi user ko success dikhao
        }

        return res.status(201).json({
            success: true,
            message: 'Your enquiry has been submitted successfully. We will get back to you soon.',
            data: newContact
        });

    } catch (error) {
        console.error('❌ Contact submit error:', error.message);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Get all enquiries (Admin)
// @route   GET /api/contact/all
// ─────────────────────────────────────────────
const getAllEnquiries = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [enquiries, total] = await Promise.all([
            Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Contact.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            data: enquiries
        });

    } catch (error) {
        console.error('❌ Get enquiries error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Update enquiry status (Admin)
// @route   PATCH /api/contact/status/:id
// ─────────────────────────────────────────────
const updateEnquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Use: pending, read, or replied'
            });
        }

        const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Enquiry not found.' });
        }

        return res.status(200).json({ success: true, message: 'Status updated successfully.', data: updated });

    } catch (error) {
        console.error('❌ Update status error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// ─────────────────────────────────────────────
// @desc    Delete enquiry (Admin)
// @route   DELETE /api/contact/:id
// ─────────────────────────────────────────────
const deleteEnquiry = async (req, res) => {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Enquiry not found.' });
        }

        return res.status(200).json({ success: true, message: 'Enquiry deleted successfully.' });

    } catch (error) {
        console.error('❌ Delete enquiry error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    submitEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    deleteEnquiry
};