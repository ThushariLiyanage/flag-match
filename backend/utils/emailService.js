const nodemailer = require('nodemailer');

const isEmailConfigured = () => {
  return (
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD &&
    !process.env.EMAIL_USER.startsWith('your-') &&
    !process.env.EMAIL_PASSWORD.startsWith('your-')
  );
};

let transporter = null;

if (isEmailConfigured()) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

const sendOTPEmail = async (email, code) => {
  if (!isEmailConfigured()) {
    console.warn('Email credentials not configured. Skipping OTP email.');
    return { success: false, skipped: true, message: 'Email service not configured' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Flag Match Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0C1F2B; color: #FFCF33; padding: 20px; text-align: center; border-radius: 8px; }
              .content { background: #efdfbf; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
              .code { font-size: 36px; font-weight: bold; color: #0C1F2B; letter-spacing: 4px; margin: 20px 0; }
              .footer { color: #8A7023; font-size: 12px; text-align: center; }
              .warning { color: #D32F2F; font-size: 12px; margin: 10px 0; }
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
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail, isEmailConfigured };
