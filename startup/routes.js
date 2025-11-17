const express = require("express");
const skillTypes = require("../routes/skill_type_routes");
const genres = require("../routes/genres");
const users = require("../routes/user_routes");
const sendMail = require("../routes/mail_routes");
const tasks = require("../routes/task_routes");
const resume = require("../routes/resume_routes");
const auth = require("../routes/auth_routes");
const exam = require("../routes/exam_routes");

const error = require("../middleware/catchError");

module.exports = function (app) {
  // API middleware
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/auth", auth);
  app.use("/api/skill-types", skillTypes);
  app.use("/api/user", users);
  app.use("/api/mail", sendMail);
  app.use("/api/tasks", tasks);
  app.use("/api/resume", resume);
  app.use("/api/exam", exam);
  // global error handling
  app.use(error);
};
