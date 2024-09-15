import nodemailer from 'nodemailer';
require('dotenv').config();

// Configure email transport
export const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

// Function to send email
export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://eventexchange.online/api/users/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'EventExchange - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for your EventExchange account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" 
           style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Reset Password
        </a>
        <p style="margin-top: 20px;">This link is valid for <strong>1 hour</strong>. If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        <p>Thank you,<br>EventExchange Team</p>
        <hr>
        <p style="font-size: 12px; color: #777;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #777;">${resetLink}</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
