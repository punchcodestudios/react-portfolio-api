const Joi = require("joi");
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  taskGroup: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
  },
  updatedOn: {
    type: Date,
    required: false,
  },
  deletedOn: {
    type: Date,
    required: false,
  },
});

const Task = mongoose.model("Task", taskSchema, "tasks");

function validateTask(task) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().min(5).max(250).required(),
    dueDate: Joi.date().required(),
    taskGroup: Joi.string().required(),
    status: Joi.string().required(),
  });

  return schema.validate(task);
}

exports.Task = Task;
exports.validate = validateTask;
