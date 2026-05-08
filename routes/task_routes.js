const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");
const responseController = require("../controllers/response");
const { isAuthenticated } = require("../controllers/auth");

router.post(
  "/add-task",
  isAuthenticated,
  taskController.addTask,
  responseController.sendSuccessResponse,
);

router.post(
  "/update-task",
  isAuthenticated,
  taskController.updateTask,
  responseController.sendSuccessResponse,
);

router.get(
  "/get-tasks",
  taskController.getTasks,
  responseController.sendSuccessResponse,
);

router.get(
  "/get-task/:id",
  taskController.getTask,
  responseController.sendSuccessResponse,
);

router.post(
  "/complete-task",
  isAuthenticated,
  taskController.completeTask,
  responseController.sendSuccessResponse,
);

module.exports = router;
