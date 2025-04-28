const { SkillType, validate } = require("../models/skill_type");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const skillTypes = await SkillType.find().sort("name");
  res.send({ count: skillTypes.length, results: skillTypes });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skillType = new SkillType({
    name: req.body.name,
    refid: req.body.refid,
    description: req.body.description,
    slug: req.body.slug,
  });
  skillType = await skillType.save();

  res.send(skillType);
});

router.put("/:refid", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const record = await SkillType.findOne({ refid: req.params.refid });
  const skillType = await SkillType.findByIdAndUpdate(
    record.id,
    {
      name: req.body.name,
      refid: req.body.refid,
      description: req.body.description,
      slug: req.body.slug,
    },
    { new: true }
  );

  if (!skillType)
    return res
      .status(404)
      .send("The skill type with the given ID was not found.");

  res.send(skillType);
});

router.delete("/:refid", async (req, res) => {
  const record = await SkillType.findOne({ refid: req.params.refid });
  const skillType = await SkillType.findByIdAndRemove(record.id);

  if (!skillType)
    return res
      .status(404)
      .send("The skill type with the given ID was not found.");

  res.send(skill);
});

router.get("/:refid", async (req, res) => {
  const skillType = await SkillType.findOne({ refid: req.params.refid });

  if (!skillType)
    return res
      .status(404)
      .send("The skill type with the given ID was not found.");

  res.send(skillType);
});

router.post("/seed", async (req, res) => {
  req.body.forEach(async (item) => {
    let { error } = validate(item);
    if (error) return res.status(400).send(error.details[0].message);
  });

  try {
    await mongoose.connection.db.dropCollection("skilltypes");
    await SkillType.insertMany(req.body);

    const currentSkillTypes = await SkillType.find().sort("name");
    return res.status(200).send(currentSkillTypes);
  } catch {
    (ex) => {
      // todo log error messages
      return res.status(500).send("an error has occurred");
    };
  }

  return res.status(200).send("OK");
});

module.exports = router;
