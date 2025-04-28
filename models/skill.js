const Joi = require("joi");
const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
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
    maxlength: 250,
  },
  slug: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  skill_types: {
    type: Array,
    required: true,
  },
});

const Skill = mongoose.model("Skill", SkillSchema, "skills");

function validateSkill(skill) {
  const schema = {
    name: Joi.string().max(50).required(),
    refid: Joi.string().required(),
    description: Joi.string().min(5).max(250).required(),
    slug: Joi.string().min(5).max(50).required(),
    skill_types: Joi.array().items(),
  };

  return Joi.validate(skill, schema);
}

exports.Skill = Skill;
exports.SkillSchema = SkillSchema;
exports.validate = validateSkill;
