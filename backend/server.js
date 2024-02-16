const express = require("express");
const app = express();

const userRouter = require("./routers/userRouter.js");
const glossaryRouter = require("./routers/glossaryRouter.js");
const treeRouter = require("./routers/treeRouter.js");
const articleRouter = require("./routers/articleRouter.js");

// Dotenv access
require("dotenv").config();
const port = process.env.PORT;
const mongoUser = process.env.USER;
const mongoPassword = process.env.PASSWORD;

// App configurations
app.use(express.json());

// App endpoints start here
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// User endpoints
app.use("/api", userRouter);

// Glossary endpoints
app.use("/api", glossaryRouter);

// Tree endpoints
app.use("/api", treeRouter);

// Article endpoints
app.use("/api", articleRouter);

// Server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});