const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");
const responseController = require("../controllers/response");

router.post(
  "/add-task",
  taskController.addTask,
  responseController.sendSuccessResponse
);

router.post(
  "/update-task",
  taskController.updateTask,
  responseController.sendSuccessResponse
);

router.get(
  "/get-tasks",
  taskController.getTasks,
  responseController.sendSuccessResponse
);

router.get(
  "/get-task/:id",
  taskController.getTask,
  responseController.sendSuccessResponse
);

router.post(
  "/complete-task",
  taskController.completeTask,
  responseController.sendSuccessResponse
);

module.exports = router;
