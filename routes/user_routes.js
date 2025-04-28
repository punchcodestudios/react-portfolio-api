const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const responseController = require("../controllers/response");
const mailController = require("../controllers/mail");

router.get(
  "/me",
  authController.isAuthenticated,
  responseController.sendSuccessResponse
);

router.post(
  "/sign-up",
  userController.signUp,
  userController.createPassword,
  mailController.sendRegistrationConfirmation,
  responseController.sendSuccessResponse
);

router.post(
  "/login",
  userController.login,
  authController.generateAuthTokens,
  responseController.sendSuccessResponse
);

router.post(
  "/logout",
  userController.logout,
  authController.clearUserTokens,
  responseController.sendSuccessResponse
);

router.post(
  "/confirm",
  userController.confirm,
  responseController.sendSuccessResponse
);

router.get(
  "/findUser/:id",
  userController.findUser,
  responseController.sendSuccessResponse
);

router.get(
  "/getById/:id",
  userController.getById,
  responseController.sendSuccessResponse
);

router.post(
  "reset-password",
  userController.resetPassword,
  mailController.sendPasswordReset,
  responseController.sendSuccessResponse
);

module.exports = router;
