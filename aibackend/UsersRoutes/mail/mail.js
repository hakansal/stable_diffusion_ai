const nodemailer = require("nodemailer");
require("dotenv").config(); 
async function sendOneTimeMail(toEmail, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,  
      pass:  process.env.EMAIL_PASSWORD     
    }
  });

  const mailOptions = {
    from: `stablediff ai password reset`,
    to: toEmail,
    subject: subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}

module.exports =sendOneTimeMail;