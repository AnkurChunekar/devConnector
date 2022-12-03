const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationErrMsgs } = require("../constants/stringConstants");
const authVerify = require("../middlewares/authVerify.middleware");
const UserModel = require("../models/User.model");
const { getErrorsObj } = require("../utillities/utils");
const router = express.Router();

/* 

@route GET api/auth
@desc Verify user and send data if verified
@access Public

@route POST api/auth
@desc Authenticate user and send data if verified
@access Public

*/

const validators = [
  check("email", validationErrMsgs.email).isEmail(),
  check("password", validationErrMsgs.passwordCommon).exists(),
];

router
  .route("/")
  .get(authVerify, async (req, res) => {
    const { userId } = req.user;

    const user = await UserModel.findById(userId).select("-password");
    res.json(user);
  })
  .post(validators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sendInvalidRes = () =>
      res.status(400).send(getErrorsObj("Invalid credentials"));

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) return sendInvalidRes();

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) return sendInvalidRes();

    jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) throw err;
        else res.json({ message: "authorized successfully", token });
      }
    );
  });

module.exports = router;
