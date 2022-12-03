const { getErrorsObj } = require("../utillities/utils");

const errorHandler = (err, req, res, next) => {
  const { stack, message } = err;
  console.error(stack);
  res.status(500).json(getErrorsObj(message));
};

module.exports = errorHandler;
