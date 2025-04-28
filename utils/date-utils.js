const getTimeZoneDate = (date) => {
  // console.log("getTimezoneDate has been called");
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(date - offset);
};

module.exports = {
  getTimeZoneDate,
};
