const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../controllers/auth");
const isAdmin = require("../middleware/admin");
const userController = require("../controllers/admin_users");

router.get("/list", isAuthenticated, isAdmin, userController.getUserList);
router.get("/me", isAuthenticated, userController.getAuthenticatedUser);
router.get("/:id", isAuthenticated, isAdmin, userController.getUserById);

module.exports = router;
