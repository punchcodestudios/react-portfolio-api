const winston = require("winston");

module.exports = async function (err, req, res, next) {
  const logger = winston.loggers.get("appLogger");
  const statusCode = err.status || err.statusCode || 500;
  logger.error(err, statusCode);
  return res.status(statusCode).json({
    content: {
      target: [],
      meta: { total: 0, success: false },
      error: { status: statusCode, message: err.message, type: "api" },
    },
  });
};
