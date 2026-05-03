const nodemailer = require('nodemailer');

let transporter;

try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'dummy@gmail.com',
      pass: process.env.EMAIL_PASS || 'dummypass'
    }
  });
} catch (error) {
  console.warn('Nodemailer setup failed (check environment variables)');
}

exports.sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject} | Text: ${text}`);
    return;
  }

  try {
    const mailOptions = {
      from: `"ClearPass Academic System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
