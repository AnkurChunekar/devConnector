const express = require("express");
const router = express.Router();

/* 
@route GET api/posts
@desc Test route
@access Public
*/

router.route("/").get((req, res) => {
  res.send("Posts here");
});

module.exports = router;
