const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const Profile = require("../../models/Profile.model");
const { getErrorsObj, getSanitizedObj } = require("../../utillities/utils");

const KEYS_ARRAY = {
  experience: [
    "title",
    "company",
    "location",
    "from",
    "to",
    "current",
    "description",
  ],
};

const expValidators = [
  check("title", "title is required").not().isEmpty(),
  check("company", "company is required").not().isEmpty(),
  check("from", "from date is required").isDate({ format: "DD-MM-YYYY" }),
];

const delExpValidators = [check("_id", "_id is required").not().isEmpty()];

router
  .route("/")

  // @route POST api/profiles/me/experience
  // @desc adds new experience data to profile
  // @access Private

  .post(expValidators, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;

      const expData = getSanitizedObj(KEYS_ARRAY.experience, req.body);
      const profile = await Profile.findOne({ user: userId });

      if (!profile)
        return res.status(400).json(getErrorsObj("Profile doesn't exists"));

      profile.experience.unshift(expData);

      const newProfile = await profile.save();
      res.json({ profile: newProfile });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(getErrorsObj(error.message));
    }
  })

  // @route DELETE api/profiles/me/experience
  // @desc deletes the experience with given id.
  // @access Private

  .delete(delExpValidators, async (req, res) => {
    try {
      const { userId } = req.user;
      const expId = req.body._id;
      const profile = await Profile.findOne({ user: userId });

      if (!profile)
        return res.status(400).json(getErrorsObj("Profile doesn't exists"));

      profile.experience = profile.experience.filter(
        (item) => item._id.valueOf() !== expId
      );

      await profile.save();
      res.json({ message: "experience deleted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(getErrorsObj(error.message));
    }
  });

module.exports = router;
