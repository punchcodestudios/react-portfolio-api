const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJWT = (userId, secret, expirationTime) => {
  return jwt.sign({ userId }, secret, { expiresIn: expirationTime });
};

const getAccessTokenTTL = (req, res) => {
  return process.env.ACCESS_TOKEN_LIFE * 60 * 60 * 1000;
};

const getRefreshTokenTTL = () => {
  return process.env.REFRESH_TOKEN_LIFE * 60 * 60 * 1000;
};

const encodePassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const validatePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateConfirmCode = async (digits) => {
  let array = [];
  for (i = 0; i < digits; i++) {
    array.push(Math.floor(Math.random() * 10));
  }
  const code = array.join("");
  return code;
};

module.exports = {
  generateJWT,
  getAccessTokenTTL,
  getRefreshTokenTTL,
  encodePassword,
  validatePassword,
  generateConfirmCode,
};
