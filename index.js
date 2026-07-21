//https://www.codemzy.com/blog/react-axios-interceptor
const winston = require("winston");
require("dotenv").config();
console.log("api start");

process.on("unhandledRejection", (ex) => {
  console.log("unhandled Rejection: ", ex);
  throw `${ex.message} | exception: ${ex}`;
});

console.log("api after exception handling");

const express = require("express");
const app = express();

app.use(express.json({ type: "application/json" }));
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());
const { PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === "local";

console.log("before cookie parser");
// Security
const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.COOKIE_SECRET));
const cors = require("cors");

console.log("before rate limiting");
const rateLimitMiddleware = require("./middleware/rateLimit");
app.use(rateLimitMiddleware);

console.log("before cors check isDev: ", isDev);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173", // Vite dev server:portfolio
      "http://localhost:5175", // Vite dev server:resume
      "https://punchcodestudios.com",
      "https://www.punchcodestudios.com",
      "http://punchcodestudios.com",
      "http://www.punchcodestudios.com",
      "https://punchcodestudio.com",
      "https://www.punchcodestudio.com",
      "http://punchcodestudio.com",
      "http://www.punchcodestudio.com",
      "https://pcs-portfolio-webapp.azurewebsites.net",
      "https://patrick-schandler-resume-e344e5014d57.herokuapp.com/",
    ],
    credentials: false, // Set to true only if you need cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "x-correlation-id",
      "request-id",
    ],
  }),
);

// console.log("db: ", process.env.MONGO_DB_CONNECTION);
require("./startup/logging");
const logger = winston.loggers.get("appLogger");
require("./startup/prod")(app);
require("./startup/routes")(app);
require("./startup/db")(logger);

// const config = require("config");
// if (!config.get("jwtPrivateKey")) {
//   console.error("FATAL ERROR: private key is not defined.");
//   process.exit(1);
// }

console.log("index.js: 96");
// email
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

console.log("index.js: 105");

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

console.log("index.js: 113");
// General
const port = PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
