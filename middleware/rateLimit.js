const { rateLimit } = require("express-rate-limit");

const maxMultiple = process.env.NODE_ENV === "test" ? 1000 : 1;

const baseOptions = {
  windowMs: 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true,
  handler: (req, res) => {
    res.status(429).json({
      content: {
        target: [],
        meta: {},
        error: { status: 429, message: "Too many requests" },
      },
    });
  },
};

const limiters = {
  strict: rateLimit({ ...baseOptions, max: 10 * maxMultiple }),   // login, signup, contact
  strong: rateLimit({ ...baseOptions, max: 100 * maxMultiple }),  // general mutations
  general: rateLimit({ ...baseOptions, max: 10000 * maxMultiple }), // read requests
};

const strictPaths = ["signup", "login", "contact"];

/**
 * Pure routing function: given a method and path, returns which tier to apply.
 * Exported separately so it can be unit-tested without Express objects.
 */
const selectTier = (method, path) => {
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return "general";
  if (strictPaths.some((p) => path.includes(p))) return "strict";
  return "strong";
};

module.exports = (req, res, next) =>
  limiters[selectTier(req.method, req.path)](req, res, next);

module.exports.selectTier = selectTier;
