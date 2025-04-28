const express = require("express");
const router = express.Router();

const sendgrid = async (req, res, next) => {
  // console.log("middleware.send:5");
  return next();
};

const sendContact = async (req, res, next) => {
  console.log("middleware.sendContact:10");
  return next();
};

const previewContact = async (req, res, next) => {
  // console.log("middleware.previewContact:15");
  return next();
};

module.exports = {
  sendContact,
  previewContact,
  sendgrid,
};
