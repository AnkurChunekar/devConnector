const express = require("express");
// const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post.model");
// const User = require("../../models/User.model");
const { getErrorsObj } = require("../../utillities/utils");

const router = express.Router();

// const VALIDATORS = {
//   post: [check("text", "text is required").not().isEmpty()],
// };

// @route POST api/posts/like/:id
// @desc add user id to the post of given id
// @access Private

router.route("/like/:id").put(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json(getErrorsObj("Post not found"));

    const isAlreadyLiked = post.likes.some(
      (item) => item.user.toString() === req.user.userId
    );
    if (isAlreadyLiked)
      return res.status(400).json(getErrorsObj("post already liked"));

    post.likes.unshift({ user: req.user.userId });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json(getErrorsObj("Post not found"));

    res.status(500).json(getErrorsObj(error.message));
  }
});

router.route("/unlike/:id").put(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json(getErrorsObj("Post not found"));

    post.likes = post.likes.filter(
      (item) => item.user.toString() !== req.user.userId
    );

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json(getErrorsObj("Post not found"));

    res.status(500).json(getErrorsObj(error.message));
  }
});

module.exports = router;
