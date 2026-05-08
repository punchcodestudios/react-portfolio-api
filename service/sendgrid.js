const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.PUNCHCODESTUDIOS_SENDGRID_API_KEY);

/**
 * Sends an email via SendGrid.
 * @param {{ to, from, subject, text, html }} msg
 * @returns {Promise}
 */
const send = (msg) => sgMail.send(msg);

module.exports = { send };
