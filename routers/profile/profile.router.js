const express = require("express");
const router = express.Router();
const axios = require("axios");

const authVerify = require("../../middlewares/authVerify.middleware");
const Profile = require("../../models/Profile.model");

const { getErrorsObj } = require("../../utillities/utils");
const myProfileRouter = require("./myProfile.router");

// @route Get api/profiles
// @desc Get all user profiles
// @access Public

router.route("/").get(async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json({ profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorsObj(error.message));
  }
});

// @route Get api/profiles/user/:userId
// @desc Get profile for given user id
// @access Public

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

// @route Get api/profiles/github/:username
// @desc Gets user repos from github
// @access Public

router.get("/github/:username", async (req, res) => {
  try {
    const url = `https://api.github.com/users/${req.params.username}/repos`;
    const response = await axios.get(url, {
      params: {
        per_page: "5",
        sort: "created:asc",
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      },
      timeout: 5000,
    });

    if (response.status !== 200)
      return res.status(404).json(getErrorsObj("github profile not found"));

    res.json({ repos: response.data });
  } catch (error) {
    console.error(error.message);
    res.status(500).json(getErrorsObj(error.message));
  }
});

router.use("/me", authVerify, myProfileRouter);

module.exports = router;
