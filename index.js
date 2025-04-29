//https://www.codemzy.com/blog/react-axios-interceptor
const winston = require("winston");
require("dotenv").config();

process.on("unhandledRejection", (ex) => {
  console.log("unhandled Rejection: ", ex);
  throw `${ex.message} | exception: ${ex}`;
});

const express = require("express");
const app = express();

app.use(express.json({ type: "application/json" }));
const { PORT, NODE_ENV } = process.env;
const isDev = NODE_ENV === "local";

console.log("before cookie parser");
// Security
const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.COOKIE_SECRET));
const cors = require("cors");

console.log("before rate limiting");
// todo parse this out to its own middleware and return standard error object to UI
// -- BEGIN Rate Limiting
const { rateLimit } = require("express-rate-limit");
const maxMultiple = 1; // todo: set this for environment variable :: maxMultiple = process.env === 'test' ? 1000 : 1
const limiterBase = {
  windowMS: 60 * 1000,
  max: 10000 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  handler: (req, res, next, options) => {
    res.status(400).send({
      content: {
        target: [],
        meta: {},
        error: { status: 429, message: "Too many requests" },
      },
    });
  },
};

const strongestRateLimit = rateLimit({
  ...limiterBase,
  max: 10 * maxMultiple,
});

const strongRateLimit = rateLimit({
  ...limiterBase,
  max: 100 * maxMultiple,
});

const generalRateLimit = rateLimit(limiterBase);

app.use((req, res, next) => {
  const strongPaths = ["skills"];
  if (
    req.method !== "GET" &&
    req.method !== "HEAD" &&
    req.method !== "OPTION"
  ) {
    if (strongPaths.some((path) => path.includes[("signup", "login")])) {
      return strongestRateLimit(req, res, next);
    }
    return strongRateLimit(req, res, next);
  }
  return generalRateLimit(req, res, next);
});
// -- END Rate Limiting

console.log("before cors check isDev: ", isDev);
if (isDev) {
  app.use(
    cors({
      origin: ["http://localhost:5174", "http://localhost:5173"],
      methods: ["POST", "PUT", "GET", "DELETE"],
      credentials: true,
    })
  );
}

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

console.log("index.js: 113");
// General
const port = PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
