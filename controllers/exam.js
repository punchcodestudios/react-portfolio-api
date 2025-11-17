const createError = require("http-errors");
const { Exam, validate } = require("../models/exam");
const errorHandler = require("../middleware/handleError.js");
const mongoose = require("mongoose");

const getAllExams = errorHandler(async (req, res, next) => {
  try {
    const allExams = await Exam.find();
    req.data = allExams;
    // console.log("all exams: ", allExams);
    return next();
  } catch (error) {
    return next(error);
  }
});

const seedExams = errorHandler(async (req, res, next) => {
  const data = req.body;
  try {
    data.forEach(async (item) => {
      let { error } = validate(item);
      if (error) return next(createError(400, error.details[0].message));
    });

    await mongoose.connection.db.dropCollection("exams");
    await Exam.insertMany(req.body);

    const currentExams = await Exam.find();
    req.data = currentExams;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  getAllExams,
  seedExams,
};
