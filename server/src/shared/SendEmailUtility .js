const nodemailer = require("nodemailer");

class SendEmailUtility {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mail.ownfood.com.bd",
      port: 587,
      secure: false,
      auth: {
        user: "noreply@ownfood.com.bd",
        pass: "HD@OWNFOOD4321",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(emailTo, emailText, emailSubject) {
    try {
      const mailOptions = {
        from: "OwnFood Account <noreply@ownfood.com.bd>",
        to: emailTo,
        subject: emailSubject,
        html: emailText,
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}

module.exports = new SendEmailUtility();
