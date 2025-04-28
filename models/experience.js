const Joi = require("joi");
const mongoose = require("mongoose");
const SkillSchema = require("./skill");

const Experience = mongoose.model(
  "Experience",
  new mongoose.Schema({
    company_name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    refid: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: false,
    },
    end_date: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    skills: {
      type: Array,
      required: true,
    },
    sort_order: {
      type: String,
      required: true,
    },
    experience_line_items: {
      type: Array,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      minlength: 5,
    },
  })
);

function validateExperience(experience) {
  const schema = {
    company_name: Joi.string().max(50).required(),
    refid: Joi.string().required(),
    start_date: Joi.string().allow(null, ""),
    end_date: Joi.string().allow(null, ""),
    position: Joi.string().allow(null, ""),
    location: Joi.string().allow(null, ""),
    skills: Joi.array(),
    sort_order: Joi.string().required(),
    // .min(1)
    // .items({
    //   name: Joi.string().max(50).required(),
    //   refid: Joi.string().required(),
    //   description: Joi.string().min(5).max(250).required(),
    //   slug: Joi.string().min(5).max(50).required(),
    //   skill_types: Joi.array()
    //     .min(1)
    //     .items({
    //       name: Joi.string().max(50).required(),
    //       refid: Joi.string().required(),
    //       description: Joi.string().min(5).required(),
    //       slug: Joi.string().min(5).required(),
    //     }),
    // }),
    experience_line_items: Joi.array().required(),
    slug: Joi.string().min(5).required(),
  };

  return Joi.validate(experience, schema);
}

exports.Experience = Experience;
exports.validate = validateExperience;
