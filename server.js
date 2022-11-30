const express = require("express");
require("dotenv").config();
const { initializeDbConnection } = require("./db/db.connect");

const app = express();
const PORT = process.env.PORT;

initializeDbConnection();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
