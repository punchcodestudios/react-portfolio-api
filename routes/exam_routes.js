const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam");
const responseController = require("../controllers/response");
const { isAuthenticated } = require("../controllers/auth");

router.get(
  "/get-all-exams",
  examController.getAllExams,
  responseController.sendSuccessResponse,
);

router.post(
  "/seed-exams",
  isAuthenticated,
  examController.seedExams,
  responseController.sendSuccessResponse,
);

module.exports = router;
