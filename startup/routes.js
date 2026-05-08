const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const skillTypes = require("../routes/skill_type_routes");
const genres = require("../routes/genres");
const users = require("../routes/user_routes");
const sendMail = require("../routes/mail_routes");
const tasks = require("../routes/task_routes");
const resume = require("../routes/resume_routes");
const auth = require("../routes/auth_routes");
const exam = require("../routes/exam_routes");

const error = require("../middleware/catchError");
const simulateError = require("../middleware/simulateError");

const morganStream = {
  write: (message) => winston.loggers.get("appLogger").info(message.trim()),
};

module.exports = function (app) {
  // Request-level access logging (API routes only)
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: morganStream,
      skip: (req) => !req.path.startsWith("/api"),
    }),
  );
  // API middleware
  app.use(express.json());
  app.use("/api", simulateError);
  app.use("/api/genres", genres);
  app.use("/api/auth", auth);
  app.use("/api/skill-types", skillTypes);
  app.use("/api/user", users);
  app.use("/api/mail", sendMail);
  app.use("/api/tasks", tasks);
  app.use("/api/resume", resume);
  app.use("/api/exam", exam);
  // 404 handler for unmatched API routes
  app.use("/api", (req, res) => {
    res
      .status(404)
      .json({ error: { status: 404, message: "API route not found" } });
  });
  // global error handling
  app.use(error);
};
