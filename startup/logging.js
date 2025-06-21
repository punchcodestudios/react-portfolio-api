//https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/#formatting-your-log-messages

const winston = require("winston");
require("winston-mongodb");
require("winston-daily-rotate-file");
const { combine, timestamp, json, errors, uncolorize } = winston.format;

const path = require("path");
const logDir = path.join(path.resolve(__dirname, ".."), "/logs");

console.log("logger connection");

const connection = process.env.MONGO_DB_CONNECTION;

const dbLogger = new winston.transports.MongoDB({
  db: connection,
  level: "error",
});

const consoleLogger = new winston.transports.Console({
  format: winston.format.cli(),
});
const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const dailyFile = new winston.transports.DailyRotateFile({
  filename: "pcs_combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  level: "info",
  dirname: logDir,
  format: combine(timestamp(), json(), uncolorize()),
});

const dailyErrorFile = new winston.transports.DailyRotateFile({
  filename: "pcs_error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "error",
  dirname: logDir,
  format: combine(
    errorFilter(),
    errors({ stack: true }),
    timestamp(),
    json(),
    uncolorize()
  ),
});

const dailyExceptionFile = new winston.transports.DailyRotateFile({
  filename: "pcs_exception-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "error",
  dirname: logDir,
  format: combine(errors({ stack: true }), timestamp(), json()),
});

const dailyRejectionFile = new winston.transports.DailyRotateFile({
  filename: "pcs_rejection-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "error",
  dirname: logDir,
  format: combine(errors({ stack: true }), timestamp(), json()),
});

winston.loggers.add("appLogger", {
  level: process.env.LOG_LEVEL || "info",
  transports: [consoleLogger, dailyFile, dailyErrorFile, dbLogger],
  exceptionHandlers: [dailyExceptionFile],
  rejectionHandlers: [dailyRejectionFile],
});
