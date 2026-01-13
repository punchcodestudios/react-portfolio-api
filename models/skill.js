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
    maxlength: 500,
  },
  slug: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250,
  },
  level: {
    type: String,
    required: false,
    maxlength: 50,
  },
  category: {
    type: String,
    required: false,
    maxlength: 100,
  },
  companies: {
    type: [String],
    required: false,
    default: [],
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
    description: Joi.string().min(5).max(500).required(),
    slug: Joi.string().min(5).max(250).required(),
    level: Joi.string().max(50).optional(),
    category: Joi.string().max(100).optional(),
    companies: Joi.array().items(Joi.string()).optional(),
    skill_types: Joi.array().items(),
  };

  return Joi.validate(skill, schema);
}

exports.Skill = Skill;
exports.SkillSchema = SkillSchema;
exports.validate = validateSkill;
