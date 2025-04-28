const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail");
const mailMiddleware = require("../middleware/mail");
const responseController = require("../controllers/response");

router.post(
  "/send-contact",
  mailController.sendContact,
  responseController.sendSuccessResponse
);
router.get(
  "/preview-contact",
  mailController.previewContact,
  responseController.sendSuccessResponse
);

module.exports = router;
