const express = require("express");
const router = express.Router();

const skillController = require("../controllers/skill");
const experienceController = require("../controllers/experience");
const responseController = require("../controllers/response");
const { isAuthenticated } = require("../controllers/auth");

router.get(
  "/get-all-skills",
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
  isAuthenticated,
  skillController.addSkills,
  responseController.sendSuccessResponse,
);
router.post(
  "/update-skill",
  isAuthenticated,
  skillController.updateSkill,
  responseController.sendSuccessResponse,
);
router.post(
  "/seed-skills",
  isAuthenticated,
  skillController.seedSkills,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-skill/:id",
  isAuthenticated,
  skillController.deleteSkill,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-skills",
  isAuthenticated,
  skillController.deleteAllSkills,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-all-skills",
  isAuthenticated,
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
  isAuthenticated,
  experienceController.addExperience,
  responseController.sendSuccessResponse,
);
router.post(
  "/update-experience",
  isAuthenticated,
  experienceController.updateExperience,
  responseController.sendSuccessResponse,
);
router.delete(
  "/delete-experience/:id",
  isAuthenticated,
  experienceController.deleteExperience,
  responseController.sendSuccessResponse,
);
router.post(
  "/seed-experience",
  isAuthenticated,
  experienceController.seedExperience,
  responseController.sendSuccessResponse,
);

module.exports = router;
