const Joi = require("joi");
const mongoose = require("mongoose");

const SkillType = mongoose.model(
  "SkillType",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    refid: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
    },
    slug: {
      type: String,
      required: true,
      minlength: 5,
    },
  })
);

function validateSkillType(skillType) {
  const SkillTypeSchema = {
    name: Joi.string().max(50).required(),
    refid: Joi.string().required(),
    description: Joi.string().min(5).required(),
    slug: Joi.string().min(5).required(),
  };

  return Joi.validate(skillType, SkillTypeSchema);
}

exports.SkillType = SkillType;
exports.validate = validateSkillType;
