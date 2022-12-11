const express = require("express");
const authVerify = require("../middlewares/authVerify.middleware");
const router = express.Router();
const Profile = require("../models/Profile.model");
const { getErrorsObj } = require("../utillities/utils");

/* 
@route GET api/profile/me
@desc Get current users profile data.
@access Private
*/

router.route("/me").get(authVerify, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.userId }).populate(
    "user",
    ["name", "avatar"]
  );

  if (!profile) res.status(400).json(getErrorsObj("Profile doesn't exists"));
  else res.json({ profile });

  res.send("Profile here");
});

module.exports = router;
