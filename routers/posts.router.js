const express = require("express");
const { check, validationResult } = require("express-validator");

const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { getErrorsObj, getSanitizedObj } = require("../utillities/utils");

const router = express.Router();

const VALIDATORS = {
  post: [check("text", "text is required").not().isEmpty()],
};

// @route POST api/posts
// @desc add a new post
// @access Private

router
  .route("/")
  .post(VALIDATORS.post, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;

      const user = await User.findById(userId).select("-password");
      const post = new Post({
        text: req.body.text,
        user: userId,
        name: user.name,
        avatar: user.avatar,
      });

      const savedPost = await post.save();
      res.json(savedPost);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(getErrorsObj(error.message));
    }
  })

  // @route GET api/posts
  // @desc Get all the posts sorted in latest first format.
  // @access Private

  .get(async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json({ posts });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(getErrorsObj(error.message));
    }
  });

module.exports = router;
