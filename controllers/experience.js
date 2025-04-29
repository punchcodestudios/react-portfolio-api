const createError = require("http-errors");
const { Experience, validate } = require("../models/experience");
const errorHandler = require("../middleware/handleError.js");

const getAllExperience = errorHandler(async (req, res, next) => {
  try {
    // return next(createError(418, "Experience error fabricated for testing"));
    const experiences = await Experience.find();
    req.data = experiences;
    return next();
  } catch (error) {
    return next(createError(418, error));
  }
});

const getExperienceById = errorHandler(async (req, res, next) => {
  try {
    const experience = await Experience.findOne({ refid: req.params.refid });

    if (!experience)
      return next(
        createError(404, "The experience with the given ID was not found.")
      );

    req.data = [experience];
    return next();
  } catch (error) {
    return next(createError(418, error));
  }
});

const addExperience = errorHandler(async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return next();

  // try {
  //   let experience = new Experience({
  //     company_name: req.body.company_name,
  //     refid: req.body.refid,
  //     date_range: req.body.date_range,
  //     position: req.body.position,
  //     skills: req.body.skills,
  //     experience_line_items: req.body.experience_line_items,
  //     slug: req.body.slug,
  //   });
  //   experience = await experience.save();

  //   req.data = [experience];
  //   return next();
  // } catch (error) {
  //   return next(createError(418, error));
  // }
});

const updateExperience = errorHandler(async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return next(createError(400, error.details[0].message));
  return next();

  // try {
  //   const record = await Experience.findOne({ refid: req.params.refid });
  //   const experience = await Experience.findByIdAndUpdate(
  //     record.id,
  //     {
  //       company_name: req.body.company_name,
  //       refid: req.body.refid,
  //       date_range: req.body.date_range,
  //       position: req.body.position,
  //       skills: req.body.skills,
  //       experience_line_items: req.body.experience_line_items,
  //       slug: req.body.slug,
  //     },
  //     { new: true }
  //   );

  //   if (!experience) return next(createError(404, error));
  //   req.data = [record];
  //   return next();
  // } catch (error) {
  //   return next(createError(418, error));
  // }
});

const deleteExperience = errorHandler(async (req, res, next) => {
  return next();
  // try {
  //   const record = await Experience.findOne({ refid: req.params.refid });
  //   const experience = await Experience.findByIdAndRemove(record.id);
  //   if (!experience)
  //     return res
  //       .status(404)
  //       .send("The experience with the given ID was not found.");
  //   req.data = [];
  //   return next();
  // } catch (error) {
  //   return next(createError(418, error));
  // }
});

const seedExperience = errorHandler(async (req, res, next) => {
  console.log("seed experience: ", req.body);
  req.body.forEach(async (item) => {
    let { error } = validate(item);
    if (error) return res.status(400).send();
  });
  try {
    if (!(await Experience.find())) {
      await Experience.insertMany(req.body).catch((err) => console.log(err));
      const currentExperience = await Experience.find();
      req.data = currentExperience;
      return next();
    }
  } catch {
    (error) => {
      console.log("error: ", error);
      return next(createError(418, error));
    };
  }
});

module.exports = {
  getAllExperience,
  getExperienceById,
  addExperience,
  updateExperience,
  deleteExperience,
  seedExperience,
};
