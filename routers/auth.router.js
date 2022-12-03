const express = require("express");
const UserModel = require("../models/User.model");
const router = express.Router();

/* 
@route GET api/auth
@desc Verify user and send data if verified
@access Public
*/

router.route("/").get(async (req, res) => {
  const { userId } = req.user;

  const user = await UserModel.findById(userId).select("-password");
  console.log(user);
  res.json(user);
});

module.exports = router;
