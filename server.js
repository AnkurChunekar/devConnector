// external
const express = require("express");
require("dotenv").config();

// internal
const { initializeDbConnection } = require("./db/db.connect");
const authRouter = require("./routers/auth.router");
const postsRouter = require("./routers/posts.router");
const usersRouter = require("./routers/users.router");
const profileRouter = require("./routers/profile.router");

const routeNotFound = require("./middlewares/routeNotFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();
const PORT = process.env.PORT;

// connect to db
initializeDbConnection();

// middleware init
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);

// error handling routes
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
