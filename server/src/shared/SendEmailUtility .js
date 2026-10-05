const nodemailer = require("nodemailer");

// SMTP settings come from the environment (SMTP_HOST, SMTP_PORT, SMTP_USER,
// SMTP_PASS, EMAIL_FROM). Credentials must never be committed to the code.
class SendEmailUtility {
  constructor() {
    this.configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    this.transporter = this.configured
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      : null;
  }

  async sendEmail(emailTo, emailText, emailSubject) {
    if (!this.configured) {
      throw new Error("Email is not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS.");
    }
    try {
      return await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || `BEHB Hotel Booking <${process.env.SMTP_USER}>`,
        to: emailTo,
        subject: emailSubject,
        html: emailText,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}

module.exports = new SendEmailUtility();
