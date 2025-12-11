const path = require('path');
const nodemailer = require('nodemailer');

// Validate real email credentials
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const isEmailConfigured = () => {
  const configured = (
    process.env.EMAIL_USER &&
    !process.env.EMAIL_USER.startsWith('your-') &&
    process.env.EMAIL_PASS &&
    !process.env.EMAIL_PASS.startsWith('your-')
  );
  console.log('[EmailService] Email configured:', configured);
  return configured;
};

// Create transporter on demand 
const getTransporter = () => {
  if (!isEmailConfigured()) {
    console.warn('[EmailService] Email credentials not configured');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOTPEmail = async (email, code) => {
  console.log('[EmailService] sendOTPEmail called for:', email);
  
  if (!isEmailConfigured()) {
    console.warn('[EmailService] Email credentials not configured. Skipping OTP email.');
    return { success: false, skipped: true, message: 'Email service not configured' };
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }

    console.log('[EmailService] Sending email via Gmail SMTP...');

    const info = await transporter.sendMail({
      from: `Flag Match <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Flag Match Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0C1F2B; color: #FFCF33; padding: 20px; text-align: center; border-radius: 8px; }
              .header h1 { margin: 0; font-size: 28px; }
              .header p { margin: 5px 0 0 0; font-size: 14px; }
              .content { background: #efdfbf; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
              .code { font-size: 48px; font-weight: bold; color: #0C1F2B; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }
              .footer { color: #8A7023; font-size: 12px; text-align: center; }
              .warning { color: #D32F2F; font-size: 12px; margin: 10px 0; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏴 Flag Match</h1>
                <p>Two-Factor Authentication</p>
              </div>

              <div class="content">
                <h2>Verify Your Identity</h2>
                <p>Your verification code is:</p>
                <div class="code">${code}</div>
                <p class="warning">⚠️ This code expires in 5 minutes</p>
                <p class="warning">Never share this code with anyone</p>
              </div>

              <div class="footer">
                <p>Secured by the Royal Navy</p>
                <p>© Flag Match ${new Date().getFullYear()}</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    console.log('[EmailService] Gmail response:', info.messageId);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('[EmailService] Error sending email:', error.message);
  
   // Return error and defer handling to caller
    return { success: false, message: 'Failed to send OTP email: ' + error.message };
  }
};

const sendResetEmail = async (email, code) => {
  console.log('[EmailService] sendResetEmail called for:', email);

  if (!isEmailConfigured()) {
    console.warn('[EmailService] Email credentials not configured. Skipping reset email.');
    return { success: false, skipped: true, message: 'Email service not configured' };
  }

  try {
    const transporter = getTransporter();
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }

    const info = await transporter.sendMail({
      from: `Flag Match <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Flag Match Password Reset',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0C1F2B; color: #FFCF33; padding: 20px; text-align: center; border-radius: 8px; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #efdfbf; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
              .code { font-size: 42px; font-weight: bold; color: #0C1F2B; letter-spacing: 6px; margin: 20px 0; font-family: 'Courier New', monospace; }
              .footer { color: #8A7023; font-size: 12px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reset Your Password</h1>
              </div>

              <div class="content">
                <p>Use this code to reset your Flag Match password:</p>
                <div class="code">${code}</div>
                <p>This code expires in 5 minutes.</p>
              </div>

              <div class="footer">
                <p>© Flag Match ${new Date().getFullYear()}</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    console.log('[EmailService] Reset email response:', info.messageId);
    return { success: true, message: 'Reset email sent' };
  } catch (error) {
    console.error('[EmailService] Error sending reset email:', error.message);
    return { success: false, message: 'Failed to send reset email: ' + error.message };
  }
};

module.exports = { sendOTPEmail, sendResetEmail, isEmailConfigured };
