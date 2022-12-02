const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { validationErrMsgs } = require("../constants/stringConstants");

/* 
@route POST api/users
@desc Add a new user
@access Public
*/

const validators = [
  check("email", validationErrMsgs.email).isEmail(),
  check("name", validationErrMsgs.name).not().isEmpty(),
  check("password", validationErrMsgs.password).isLength({ min: 6 }),
];

router.route("/").post(validators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    res.json({ reqBody: req.body });
  }
});

module.exports = router;
