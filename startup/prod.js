const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet());
  app.use(
    contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "api.rawg.io"],
        imgSrc: ["'self'", "media.rawg.io"],
        scriptSrc: ["https: unsafe-inline"],
      },
    })
  );
  app.use(compression());
};
