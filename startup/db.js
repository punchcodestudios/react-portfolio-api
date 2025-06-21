const mongoose = require("mongoose");

module.exports = function (logger) {
  mongoose
    .connect(process.env.MONGO_DB_CONNECTION)
    .then(() => logger.info("Connected to MongoDB..."));
};
