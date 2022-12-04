const { getErrorsObj } = require("../utillities/utils");

const routeNotFound = (req, res, next) => {
  res.status(404).json(getErrorsObj("route not found"));
  next();
};

module.exports = routeNotFound;
