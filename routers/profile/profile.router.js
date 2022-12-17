const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const authVerify = require("../../middlewares/authVerify.middleware");
const Profile = require("../../models/Profile.model");
const User = require("../../models/User.model");
const { getErrorsObj, getSanitizedObj } = require("../../utillities/utils");
const experienceRouter = require("./experience.router");

const socialsArr = ["linkedin", "twitter", "youtube", "facebook", "instagram"];

const profileKeysArr = [
  "company",
  "website",
  "location",
  "bio",
  "status",
  "githubUsername",
  "skills",
  "social",
];

/* 

@route Get api/profiles
@desc Get all user profiles
@access Public

*/

router.route("/").get(async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json({ profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorsObj(error.message));
  }
});

/* 

@route Get api/profiles/user/:userId
@desc Get profile for given user id
@access Public

*/

router.route("/user/:userId").get(async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile)
      return res.status(400).json(getErrorsObj("profile not found"));

    res.json({ profile });
  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId")
      return res.status(400).json(getErrorsObj("profile not found"));
    res.status(500).json(error);
  }
});

const validators = [
  check("status", "status is required").not().isEmpty(),
  check("skills", "skills are required").not().isEmpty(),
];

router
  .route("/me")

  // @route GET api/profiles/me
  // @desc Get current users profile data.
  // @access Private

  .get(authVerify, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.userId }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!profile)
        res.status(400).json(getErrorsObj("Profile doesn't exists"));
      else res.json({ profile });
    } catch (error) {
      res.status(500).json(getErrorsObj(error.message));
    }
  })

  // @route POST api/profiles/me
  // @desc Create or update user profile
  // @access Private

  .post(authVerify, validators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.user;
    const profileObj = getSanitizedObj(profileKeysArr, req.body);

    if (profileObj.skills)
      profileObj.skills = profileObj.skills
        .split(",")
        .map((item) => item.trim());

    if (profileObj.socials) {
      profileObj.socials = getSanitizedObj(socialsArr, profileObj.socials);
    }

    let profile = await Profile.findOne({ user: userId });

    try {
      if (profile) {
        //  update
        // { user: userId } filter : finds the profile where user field has the given id
        // { $set: profileObj }
        // { new: true } returns the newly generated document if not passed by default the older one is returned

        profile = await Profile.findOneAndUpdate(
          { user: userId },
          { $set: profileObj },
          { new: true }
        );
      } else {
        // add new
        profileObj.user = userId;
        profile = await new Profile(profileObj);
        profile.save();
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json(getErrorsObj(error.message));
    }
  })

  // @route DELETE api/profiles/me
  // @desc deletes both current user data and profile
  // @access Private

  .delete(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      await Profile.findOneAndRemove({ user: userId });
      await User.findOneAndRemove({ _id: userId });

      res.json({ message: "user deleted successfully" });
    } catch (error) {
      res.status(500).json(getErrorsObj(error.message));
    }
  });

router.use("/me/experience", authVerify, experienceRouter);

module.exports = router;