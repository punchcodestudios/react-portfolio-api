const errorHandler = require("../middleware/handleError.js");
const { Task } = require("../models/task.js");
const { TaskStatus } = require("../utils/constants.js");

const getTask = errorHandler(async (req, res, next) => {
  let data = await Task.findById(req.params.id);
  req.data = [data];
  return next();
});

const getTasks = errorHandler(async (req, res, next) => {
  let data = await Task.find({});
  data = [...data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))];
  req.data = data;
  return next();
});

const addTask = errorHandler(async (req, res, next) => {
  let task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: new Date(req.body.dueDate).toUTCString(),
    taskGroup: req.body.taskGroup,
    status: TaskStatus.ACTIVE,
    createdOn: new Date(Date.now()).toUTCString(),
    updatedOn: "",
    deletedOn: "",
  });

  const data = await task.save();
  req.data = [data];
  return next();
});

const updateTask = errorHandler(async (req, res, next) => {
  const data = await Task.findByIdAndUpdate(
    req.body.id,
    {
      title: req.body.title,
      description: req.body.description,
      dueDate: new Date(req.body.dueDate).toUTCString(),
      taskGroup: req.body.taskGroup,
      status: TaskStatus.ACTIVE,
      updatedOn: new Date(Date.now()).toUTCString(),
    },
    { new: true }
  );
  req.data = [data];
  return next();
});

const completeTask = errorHandler(async (req, res, next) => {
  let data = await Task.findOneAndUpdate(
    { _id: req.body.id },
    {
      deletedOn: new Date(Date.now()).toUTCString(),
      status: TaskStatus.COMPLETE,
    },
    { new: true }
  );

  req.data = [data];
  return next();
});

module.exports = {
  getTask,
  getTasks,
  addTask,
  updateTask,
  completeTask,
};
