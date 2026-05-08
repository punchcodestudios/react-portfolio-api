const createError = require("http-errors");

/**
 * Development/staging only middleware for testing UI error handling.
 *
 * Usage: add the header `x-simulate-error: <statusCode>` to any request.
 * The middleware will short-circuit with an HTTP error of that status code.
 *
 * Example (Postman / browser devtools):
 *   x-simulate-error: 500   → Internal Server Error
 *   x-simulate-error: 404   → Not Found
 *   x-simulate-error: 403   → Forbidden
 *
 * Has no effect in production (NODE_ENV=production).
 */
module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === "production") return next();

  const requestedCode = req.get("x-simulate-error");
  if (!requestedCode) return next();

  const statusCode = parseInt(requestedCode, 10);
  if (isNaN(statusCode) || statusCode < 400 || statusCode > 599) {
    return next(
      createError(
        400,
        "x-simulate-error must be a valid HTTP error status code (400–599)",
      ),
    );
  }

  return next(createError(statusCode));
};
