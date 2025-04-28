const sendRegisterEmail = (req, res) => {
  const msg = {
    to: "pschandler@gmail.com",
    from: "admin@punchcodestudios.com",
    subject: "Thank you for registering at punchcodestudios.com",
    text: "this should be the registration verification.",
    html: "<strong>this should be the registration verification</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      // console.log("email sent");
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
};

module.exports = {
  sendRegisterEmail,
};
