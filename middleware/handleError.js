const errorHandler = (fn) => (req, res, next) => {
  // console.log("caught here");
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = errorHandler;
