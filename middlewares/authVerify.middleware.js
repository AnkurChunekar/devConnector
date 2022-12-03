const jwt = require("jsonwebtoken");
const { getErrorsObj } = require("../utillities/utils");

const authVerify = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId };
    next();
  } catch ({ message }) {
    res.status(401).json(getErrorsObj(message));
  }
};

module.exports = authVerify;
