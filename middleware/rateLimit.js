const maxMultiple = 1; // todo: set this for environment variable :: maxMultiple = process.env === 'test' ? 1000 : 1

const limiterBase = {
  windowMS: 60 * 1000,
  max: 10000 * maxMultiple,
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * used for high intesity limiting - i.e. login forms, email sending
 */
const lowLimit = {
  ...limiterBase,
  max: 5 * maxMultiple,
};

/**
 * used for medium intensity limiting - i.e. general POST requests database calls
 */
const medLimit = {
  ...limiterBase,
  max: 100 * maxMultiple,
};

const limit = (req, res, next) => {
  console.log("REQUEST METHOD: ", req.method);
  const strongPaths = ["signup", "login", "contact"];
  if (
    req.method !== "GET" &&
    req.method !== "HEAD" &&
    req.method !== "OPTION"
  ) {
    if (strongPaths.some((path) => req.path.includes(path))) return lowLimit;
  }
  return limiterBase;
};

module.exports = limit;
