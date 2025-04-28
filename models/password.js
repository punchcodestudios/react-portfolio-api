const Joi = require("joi");
const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  userId: {
    type: String,
    minlength: 5,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    required: true,
  },
});

const Password = mongoose.model("Password", passwordSchema, "passwords");

function passwordValidate(password) {
  const schema = {
    userId: Joi.unique().required(),
    password: Joi.string().min(5).required(),
  };

  return Joi.validate(password, schema);
}

exports.Password = Password;
exports.validatePassword = passwordValidate;
