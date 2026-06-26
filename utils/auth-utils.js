const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ms = require("ms");

const generateJWT = (userId, secret, expirationTime) => {
  return jwt.sign({ userId }, secret, { expiresIn: expirationTime });
};

const getAccessTokenTTL = () => ms(process.env.ACCESS_TOKEN_LIFE);

const getRefreshTokenTTL = () => ms(process.env.REFRESH_TOKEN_LIFE);

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
  for (let i = 0; i < digits; i++) {
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
