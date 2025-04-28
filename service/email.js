//https://dev.to/scofieldidehen/master-nodemailer-the-ultimate-guide-to-sending-emails-from-nodejs-24a3
//https://nodemailer.com/usage/
//https://www.geeksforgeeks.org/server-side-rendering-using-express-js-and-ejs-template-engine/

const nodemailer = require("nodemailer");
const sendMail = async (to, from, subject, text, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "punchcodestudios.com",
      port: 425,
      secure: true,
      auth: {
        user: "admin@punchcodestudios.com",
        password: "Dr@g0n8473",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      to: !to ? process.env.DEFAULT_EMAIL_RECIP : to,
      from: from,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log("error: ", error);
        throw new Error("email failed to send");
      }
    });
    // const response = await transporter.sendMail(mailOptions);
    // console.log("service/email.js:28 - ", response);
    // return response;
  } catch (error) {
    console.error("service/email.js:36 -- ", error);
    throw Error(error);
  }
};

module.exports = {
  sendMail,
};
