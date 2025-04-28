const mongoose = require("mongoose");

module.exports = function (logger) {
  //console.log("DB CONNECTION: ", process.env.MONGO_DB_CONNECTION);
  mongoose
    .connect(
      process.env.MONGO_DB_CONNECTION
      // "mongodb+srv://punchcodestudios:Dragon8473@punchcodestudios.nppuj2s.mongodb.net/punchcodestudios?retryWrites=true&w=majority&appName=punchcodestudios"
    )
    .then(() => logger.info("Connected to MongoDB_Production..."));
};
