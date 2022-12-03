const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const { validationErrMsgs } = require("../constants/stringConstants");
const UserModel = require("../models/User.model");
const { getErrorsObj } = require("../utillities/utils");

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

router.route("/").post(validators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body;

  let user = await UserModel.findOne({ email });

  if (user) return res.status(400).json(getErrorsObj("user already exists"));

  const avatar = gravatar.url(email, {
    s: "200",
    r: "pg",
    d: "mm",
  });

  user = new UserModel({
    name,
    email,
    password,
    avatar,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hashSync(password, salt);

  await user.save();

  res.json({ message: "user registered successfully" });
});

module.exports = router;
