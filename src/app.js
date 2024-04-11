// src/app.js
const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const errorMiddleware = require("./middleware/error.middleware");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use(errorMiddleware);

module.exports = app;
