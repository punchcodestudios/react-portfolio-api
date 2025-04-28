const mongoose = require("mongoose");

module.exports = function (logger) {
  mongoose
    .connect(
      process.env.MONGO_DB_CONNECTION === undefined
        ? "mongodb://127.0.0.1:27017/reactportfolio"
        : process.env.MONGO_DB_CONNECTION
    )
    .then(() => logger.info("Connected to MongoDB_Production..."));
};
