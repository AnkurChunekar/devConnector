const express = require("express");
const router = express.Router();

/* 
@route POST api/users
@desc Add a new user
@access Public
*/

router.route("/").post((req, res) => {
  const body = req.body;
  res.json(body);
});

module.exports = router;
