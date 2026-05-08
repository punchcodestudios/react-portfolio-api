//https://dev.to/scofieldidehen/master-nodemailer-the-ultimate-guide-to-sending-emails-from-nodejs-24a3
//https://nodemailer.com/usage/

const nodemailer = require("nodemailer");

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } =
  process.env;

/**
 * Sends an email via Nodemailer using SMTP credentials from environment variables.
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendMail = async (to, subject, text, html) => {
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email service is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS."
    );
  }

  const port = parseInt(EMAIL_PORT, 10) || 587;
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    to: to || process.env.DEFAULT_EMAIL_RECIP,
    from: EMAIL_FROM || EMAIL_USER,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };

