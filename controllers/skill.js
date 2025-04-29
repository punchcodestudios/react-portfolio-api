const createError = require("http-errors");
const { Skill, validate } = require("../models/skill");
const errorHandler = require("../middleware/handleError.js");
const mongoose = require("mongoose");

const getAllSkills = errorHandler(async (req, res, next) => {
  try {
    const allSkills = await Skill.find().populate({
      path: "skill_types",
      select: "refid name description",
      model: "SkillType",
      foreignField: "refid",
    });
    req.data = allSkills;
    console.log("all skills: ", allSkills);
    return next();
  } catch (error) {
    return next(error);
  }
});

const addSkills = errorHandler(async (req, res, next) => {
  return next();
  console.log("addSkills: ", [...req.body]);
  try {
    const array = [...req.body];
    array.forEach(async (item) => {
      let { error } = validate(item);
      if (error) return next(new Error(error.details[0].message));

      let duplicate = Skill.findOne({ name: item.name });
      if (duplicate)
        return next(
          createError(
            400,
            `An item named: ${item.name} already exists in our system.`
          )
        );

      try {
        let skill = new Skill({
          name: item.name,
          refid: item.refid,
          description: item.description,
          slug: item.slug,
          image_url: item.image_url,
          skill_types: item.skill_types,
        });

        skill = await skill.save();
      } catch (error) {
        return next(createError(418, error));
      }
    });
    req.data = [];
    req.total = array.length;
    return next();
  } catch (error) {
    return next(error);
  }
});

const updateSkill = errorHandler(async (req, res, next) => {
  return next();
  const { error } = validate(req.body);
  if (error) return next(createError(400, error.details[0].message));

  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        slug: req.body.slug,
        image_url: req.body.image_url,
        skill_types: req.body.skill_types,
      },
      { new: true }
    );

    if (!skill)
      return next(
        createError(401, "The skill with the given ID was not found.")
      );

    req.data = [skill];
    return next();
  } catch (error) {
    return next(error);
  }
});

const deleteSkill = errorHandler(async (req, res, next) => {
  return next();
  try {
    const skill = await Skill.findByIdAndRemove(req.params.id);
    if (!skill)
      return next(
        createError(404, "The skill with the given ID was not found.")
      );
    req.data = [];
    return next();
  } catch (error) {
    return next(error);
  }
});

const getSkillById = errorHandler(async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill)
      return next(
        createError(404, "The skill with the given ID was not found.")
      );
  } catch (error) {
    return next(error);
  }

  req.data = [skill];
  return next();
});

const seedSkills = errorHandler(async (req, res, next) => {
  return next();
  const data = req.body;
  data.forEach(async (item) => {
    let { error } = validate(item);
    if (error) return next(createError(400, error.details[0].message));
  });

  try {
    await mongoose.connection.db.dropCollection("skills");
    await Skill.insertMany(req.body);

    const currentSkills = await Skill.find();
    req.data = currentSkills;
    return next();
  } catch {
    (error) => {
      return next(createError(400, error.message));
    };
  }
  return next(createError(400, "unepected end of method."));
});

module.exports = {
  getAllSkills,
  getSkillById,
  deleteSkill,
  addSkills,
  updateSkill,
  seedSkills,
};
