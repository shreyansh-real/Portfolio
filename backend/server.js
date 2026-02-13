const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  console.log('✓ Email transporter configured');
} catch (error) {
  console.warn('⚠ Email transporter not configured. Check your .env file.');
  transporter = null;
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('📨 New contact form submission:', { name, email });

    // Validation
    if (!name || !email || !message) {
      console.warn('⚠ Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if transporter is configured
    if (!transporter || !process.env.GMAIL_EMAIL) {
      console.error('❌ Gmail not configured. Check .env file.');
      return res.status(500).json({ 
        error: 'Email service not configured. Backend is running but Gmail credentials are missing. Please configure .env file.',
        needsSetup: true
      });
    }

    // Email to you (notification)
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00d9ff; border-bottom: 2px solid #00d9ff; padding-bottom: 10px;">New Message from Your Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00d9ff; margin: 15px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p><small style="color: #999;">📅 Sent from your portfolio website on ${new Date().toLocaleString()}</small></p>
        </div>
      `,
      replyTo: email
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully:', result.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! I will get back to you soon.' 
    });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ 
      error: 'Failed to send email. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend server is running',
    gmailConfigured: !!process.env.GMAIL_EMAIL,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

// When deployed on Vercel (serverless), export a handler instead of calling listen.
// For local development keep the existing listen behavior.
if (process.env.VERCEL) {
  module.exports = (req, res) => app(req, res);
} else {
  app.listen(PORT, () => {
    console.log('\n🚀 Backend Server Started');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact Endpoint: POST http://localhost:${PORT}/api/contact`);
    console.log('\n📋 Configuration Status:');
    console.log(process.env.GMAIL_EMAIL ? '✓ Gmail email configured' : '✗ Gmail email NOT configured');
    console.log(process.env.GMAIL_PASSWORD ? '✓ Gmail password configured' : '✗ Gmail password NOT configured');
    console.log('\n💡 Tip: Make sure your React app is running on port 3000 or 5173\n');
    console.log(`Server running on port ${PORT}`);
  });
}
