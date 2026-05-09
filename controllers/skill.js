const createError = require("http-errors");
const { Skill, validate } = require("../models/skill");
const errorHandler = require("../middleware/handleError.js");
const mongoose = require("mongoose");
const { parsePagination, buildPaginationMeta } = require("../utils/pagination");

const getAllSkills = errorHandler(async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [allSkills, totalCount] = await Promise.all([
      Skill.find().skip(skip).limit(limit),
      Skill.countDocuments(),
    ]);
    req.data = allSkills;
    req.meta = buildPaginationMeta({ page, limit, totalCount });
    return next();
  } catch (error) {
    return next(error);
  }
});

const getSkillsBySlug = errorHandler(async (req, res, next) => {
  try {
    const param = req.params["slug"];
    const skills = await Skill.find({ slug: { $regex: param } });
    req.data = skills;
    return next();
  } catch (error) {
    return next(error);
  }
});

const addSkills = errorHandler(async (req, res, next) => {
  try {
    const array = [...req.body];
    array.forEach(async (item) => {
      let { error } = validate(item);
      if (error) return next(new Error(error.details[0].message));

      let duplicate = await Skill.findOne({ name: item.name });
      if (duplicate)
        return next(
          createError(
            400,
            `An item named: ${item.name} already exists in our system.`,
          ),
        );

      try {
        let skill = new Skill({
          name: item.name,
          refid: item.refid,
          description: item.description,
          slug: item.slug,
          level: item.level,
          category: item.category,
          companies: item.companies,
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
  const { error } = validate(req.body);
  if (error) return next(createError(400, error.details[0].message));

  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        refid: req.body.refid,
        description: req.body.description,
        slug: req.body.slug,
        level: req.body.level,
        category: req.body.category,
        companies: req.body.companies,
        image_url: req.body.image_url,
        skill_types: req.body.skill_types,
      },
      { new: true },
    );

    if (!skill)
      return next(
        createError(401, "The skill with the given ID was not found."),
      );

    req.data = [skill];
    return next();
  } catch (error) {
    return next(error);
  }
});

const deleteSkill = errorHandler(async (req, res, next) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError(400, "No valid skill ID provided."));
    }

    const result = await Skill.findByIdAndDelete(req.params.id);

    if (!result) {
      return next(createError(404, "No skill with the given ID was found."));
    }

    req.data = {
      deletedCount: 1,
      message: `Successfully deleted skill: ${result.name}.`,
    };
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
        createError(404, "The skill with the given ID was not found."),
      );
  } catch (error) {
    return next(error);
  }

  req.data = [skill];
  return next();
});

const seedSkills = errorHandler(async (req, res, next) => {
  // return next();
  const data = req.body;
  try {
    data.forEach(async (item) => {
      let { error } = validate(item);
      if (error) return next(createError(400, error.details[0].message));
    });

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
  return next(createError(400, "unexpected end of method."));
});

const deleteAllSkills = errorHandler(async (req, res, next) => {
  // return next();
  try {
    const result = await Skill.deleteMany({});

    req.data = {
      deletedCount: result.deletedCount,
      message: `Successfully deleted all ${result.deletedCount} skill(s) from the database.`,
    };
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  getAllSkills,
  getSkillById,
  getSkillsBySlug,
  deleteSkill,
  deleteAllSkills,
  addSkills,
  updateSkill,
  seedSkills,
};
