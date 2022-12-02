const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

/* 
@route POST api/users
@desc Add a new user
@access Public
*/

const validators = [
  check("email", "email is invalid").isEmail(),
  check("name", "please provide a valid name").not().isEmpty(),
  check(
    "password",
    "password length should be minimum 6 characters long"
  ).isLength({ min: 6 }),
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
