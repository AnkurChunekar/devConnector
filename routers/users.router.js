const express = require("express");
const router = express.Router();

/* 
@route GET api/users
@desc Test route
@access Public
*/

router.route("/").get((req, res) => {
  res.send("Users here");
});

module.exports = router;
