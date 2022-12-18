const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

const Profile = require("../../models/Profile.model");
const { getErrorsObj, getSanitizedObj } = require("../../utillities/utils");

const KEYS_ARRAY = {
  education: [
    "school",
    "degree",
    "fieldOfStudy",
    "from",
    "to",
    "current",
    "description",
  ],
};

const VALIDATORS = {
  post: [
    check("school", "school is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldOfStudy", "field of study is required").not().isEmpty(),
    check("from", "from date is required").isDate({ format: "DD-MM-YYYY" }),
  ],
  delete: [check("_id", "_id is required").not().isEmpty()],
};

router
  .route("/")

  // @route POST api/profiles/me/education
  // @desc adds new education data to profile
  // @access Private

  .post(VALIDATORS.post, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;

      const expData = getSanitizedObj(KEYS_ARRAY.education, req.body);
      const profile = await Profile.findOne({ user: userId });

      if (!profile)
        return res.status(400).json(getErrorsObj("Profile doesn't exists"));

      profile.education.unshift(expData);

      const newProfile = await profile.save();
      res.json({ profile: newProfile });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(getErrorsObj(error.message));
    }
  })

  // @route DELETE api/profiles/me/education
  // @desc deletes the education with given id.
  // @access Private

  .delete(VALIDATORS.delete, async (req, res) => {
    try {
      const { userId } = req.user;
      const eduId = req.body._id;
      const profile = await Profile.findOne({ user: userId });

      if (!profile)
        return res.status(400).json(getErrorsObj("Profile doesn't exists"));

      profile.education = profile.education.filter(
        (item) => item._id.valueOf() !== eduId
      );

      await profile.save();
      res.json({ message: "education deleted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(getErrorsObj(error.message));
    }
  });

module.exports = router;
