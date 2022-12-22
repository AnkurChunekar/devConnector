const express = require("express");
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const { getErrorsObj } = require("../../utillities/utils");
const likeRouter = require("./like.router");

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

// @route GET api/posts/:postId
// @desc Get single post with the given postId
// @access Private

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) return res.status(404).json(getErrorsObj("Post not found"));

      res.json({ post });
    } catch (error) {
      console.log(error.message);
      if (error.kind === "ObjectId")
        return res.status(404).json(getErrorsObj("Post not found"));

      res.status(500).json(getErrorsObj(error.message));
    }
  })

  // @route DELETE api/posts/:postId
  // @desc Delete single post with the given postId
  // @access Private

  .delete(async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);

      if (!post) return res.status(404).json(getErrorsObj("Post not found"));

      // authorize user
      if (post.user.toString() !== req.user.userId)
        return res.status(401).json(getErrorsObj("User not authorized"));

      await post.remove();

      res.json({ message: "post deleted successfully" });
    } catch (error) {
      console.log(error.message);
      if (error.kind === "ObjectId")
        return res.status(404).json(getErrorsObj("Post not found"));

      res.status(500).json(getErrorsObj(error.message));
    }
  });

router.put("/:postId/comment", VALIDATORS.post, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.user;
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(userId).select("-password");

    if (!post) return res.status(404).json(getErrorsObj("Post not found"));

    post.comments.push({
      user: userId,
      name: user.name,
      avatar: user.avatar,
      text: req.body.text,
    });

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json(getErrorsObj("Post not found"));

    res.status(500).json(getErrorsObj(error.message));
  }
});

// @route DELETE api/posts/:postId/comment/:commentId
// @desc delete the comment with given id
// @access Private

router.delete("/:postId/comment/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json(getErrorsObj("Post not found"));

    post.comments = post.comments.filter(
      (item) => item._id.valueOf() !== req.params.commentId
    );

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json(getErrorsObj("Post not found"));

    res.status(500).json(getErrorsObj(error.message));
  }
});

router.use("/", likeRouter);

module.exports = router;
