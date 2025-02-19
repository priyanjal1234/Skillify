import nodemailer from 'nodemailer';

async function sendMail(name,verificationCode,email) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  let mailOptions = {
    from: 'Learnify Support',
    to: email,
    subject: 'Verify your email for Learnify',
    html: `<p>Hello ${name},</p>
                     <p>Thank you for registering with Learnify! Please verify your email address with the OTP given below:</p>
                     <p>Verification Code: ${verificationCode}</p>
                     <p>This Code is Valid for 10 minutes</p>
                     <p>If you did not register for Learnify, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export default sendMail
