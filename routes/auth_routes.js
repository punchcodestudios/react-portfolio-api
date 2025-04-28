const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const responseController = require("../controllers/response");

router.post(
  "/refresh",
  authController.refreshAccessToken,
  responseController.sendSuccessResponse
);

module.exports = router;
