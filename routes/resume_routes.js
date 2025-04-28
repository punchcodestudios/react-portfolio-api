const express = require("express");
const router = express.Router();

const skillController = require("../controllers/skill");
const experienceController = require("../controllers/experience");
const responseController = require("../controllers/response");

router.get(
  "/get-all-skills",
  skillController.getAllSkills,
  responseController.sendSuccessResponse
);
router.get(
  "/get-skill/{id}",
  skillController.getSkillById,
  responseController.sendSuccessResponse
);
router.post(
  "/add-skill",
  skillController.addSkills,
  responseController.sendSuccessResponse
);
router.post(
  "/update-skill",
  skillController.updateSkill,
  responseController.sendSuccessResponse
);
router.post(
  "/seed-skills",
  skillController.seedSkills,
  responseController.sendSuccessResponse
);
router.delete(
  "/delete-skill/{id}",
  skillController.deleteSkill,
  responseController.sendSuccessResponse
);

router.get(
  "/get-all-experience",
  experienceController.getAllExperience,
  responseController.sendSuccessResponse
);
router.get(
  "/get-experience/{id}",
  experienceController.getExperienceById,
  responseController.sendSuccessResponse
);
router.post(
  "/add-experience",
  experienceController.addExperience,
  responseController.sendSuccessResponse
);
router.post(
  "/update-experience",
  experienceController.updateExperience,
  responseController.sendSuccessResponse
);
router.delete(
  "/delete-experience/{id}",
  experienceController.deleteExperience,
  responseController.sendSuccessResponse
);
router.post(
  "/seed-experience",
  experienceController.seedExperience,
  responseController.sendSuccessResponse
);

module.exports = router;
