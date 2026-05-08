const express = require("express");
const router = express.Router();

const skillController = require("../controllers/skill");
const experienceController = require("../controllers/experience");
const responseController = require("../controllers/response");
const createError = require("http-errors");

// Temporary middleware for testing error handling
// const temp500 = (req, res, next) =>
//   next(createError(500, "Internal Server Error"));

// const temp404 = (req, res, next) => next(createError(404, "Not Found"));

router.get(
  "/get-all-skills",
  // temp500,
  skillController.getAllSkills,
  responseController.sendSuccessResponse,
);
router.get(
  "/get-skills-by-slug/:slug",
  skillController.getSkillsBySlug,
  responseController.sendSuccessResponse,
);
router.get(
  "/get-skill/:id",
  skillController.getSkillById,
  responseController.sendSuccessResponse,
);
router.post(
  "/add-skill",
  skillController.addSkills,
  responseController.sendSuccessResponse,
);
router.post(
  "/update-skill",
  skillController.updateSkill,
  responseController.sendSuccessResponse,
);
router.post(
  "/seed-skills",
  skillController.seedSkills,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-skill/:id",
  skillController.deleteSkill,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-skills",
  skillController.deleteAllSkills,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-all-skills",
  skillController.deleteAllSkills,
  responseController.sendSuccessResponse,
);
router.get(
  "/get-all-experience",
  experienceController.getAllExperience,
  responseController.sendSuccessResponse,
);
router.get(
  "/get-experience/:id",
  experienceController.getExperienceById,
  responseController.sendSuccessResponse,
);
router.post(
  "/add-experience",
  experienceController.addExperience,
  responseController.sendSuccessResponse,
);
router.post(
  "/update-experience",
  experienceController.updateExperience,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-experience/:id",
  experienceController.deleteExperience,
  responseController.sendSuccessResponse,
);
router.post(
  "/seed-experience",
  experienceController.seedExperience,
  responseController.sendSuccessResponse,
);

module.exports = router;
