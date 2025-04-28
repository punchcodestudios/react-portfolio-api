const mongoose = require("mongoose");
const Joi = require("joi");

const webTokenSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userId: {
    type: String,
  },
  token: {
    type: String,
  },
  expiresOn: {
    type: String,
  },
});

const WebToken = mongoose.model("WebToken", webTokenSchema, "webtokens");

function validateToken(token) {
  const schema = {
    name: Joi.string(),
    userId: Joi.string(),
    token: Joi.string(),
    expiresOn: Joi.string(),
  };

  return Joi.validate(token, schema);
}

exports.WebToken = WebToken;
exports.validate = validateToken;
