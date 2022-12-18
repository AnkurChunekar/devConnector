const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const Profile = require("../../models/Profile.model");
const User = require("../../models/User.model");
const { getErrorsObj, getSanitizedObj } = require("../../utillities/utils");
const experienceRouter = require("./experience.router");
const educationRouter = require("./education.router");

const VALIDATORS = {
  post: [
    check("status", "status is required").not().isEmpty(),
    check("skills", "skills are required").not().isEmpty(),
  ],
};

const KEYS_ARRAYS = {
  profile: [
    "company",
    "website",
    "location",
    "bio",
    "status",
    "githubUsername",
    "skills",
    "social",
  ],
  socials: ["linkedin", "twitter", "youtube", "facebook", "instagram"],
};

router
  .route("/")

  // @route GET api/profiles/me
  // @desc Get current users profile data.
  // @access Private

  .get(async (req, res) => {
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

  .post(VALIDATORS.post, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.user;
    const profileObj = getSanitizedObj(KEYS_ARRAYS.profile, req.body);

    if (profileObj.skills)
      profileObj.skills = profileObj.skills
        .split(",")
        .map((item) => item.trim());

    if (profileObj.socials) {
      profileObj.socials = getSanitizedObj(
        KEYS_ARRAYS.socials,
        profileObj.socials
      );
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

  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      await Profile.findOneAndRemove({ user: userId });
      await User.findOneAndRemove({ _id: userId });

      res.json({ message: "user deleted successfully" });
    } catch (error) {
      res.status(500).json(getErrorsObj(error.message));
    }
  });

router.use("/experience", experienceRouter);
router.use("/education", educationRouter);

module.exports = router;
