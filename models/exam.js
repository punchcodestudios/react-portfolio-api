const Joi = require("joi");
const mongoose = require("mongoose");

const learningPathEvaluationItemsSchema = new mongoose.Schema({
  evaluation_item_id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: false,
  },
  answer: {
    type: Array,
    required: true,
  },
});

const ExamSchema = new mongoose.Schema({
  learning_path_id: {
    type: String,
    required: true,
    maxlength: 50,
  },
  learning_path_evaluation_items: {
    type: Array,
    required: true,
  },
});

const Exam = mongoose.model("Exam", ExamSchema, "exams");
const LearningPathEvaluationItem = mongoose.model(
  "LearningPathEvaluationItem",
  learningPathEvaluationItemsSchema,
  "learningPathEvaluationItems"
);

function validateExam(exam) {
  const schema = {
    learning_path_id: Joi.string().max(50).required(),
    learning_path_evaluation_items: Joi.array()
      .items(learningPathEvaluationItemsSchema)
      .required(),
  };

  return Joi.validate(exam, schema);
}

exports.Exam = Exam;
exports.LearningPathEvaluationItem = LearningPathEvaluationItem;
exports.ExamSchema = ExamSchema;
exports.learningPathEvaluationItemsSchema = learningPathEvaluationItemsSchema;
exports.validate = validateExam;
