const express = require("express");
const router = express.Router();

/* 
@route GET api/auth
@desc Test route
@access Public
*/

router.route("/").get((req, res) => {
  res.send("Auth here");
});

module.exports = router;
