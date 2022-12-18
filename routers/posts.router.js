const express = require("express");
const { check, validationResult } = require("express-validator");

const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { getErrorsObj, getSanitizedObj } = require("../utillities/utils");

const router = express.Router();

const VALIDATORS = {
  post: [check("text", "text is required").not().isEmpty()],
};

/* 
@route POSTS api/posts
@desc Test route
@access Public
*/

router.route("/").post(VALIDATORS.post, async (req, res) => {
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
});

module.exports = router;
