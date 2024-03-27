// Module imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// Routers
const userRouter = require("./routers/userRouter.js");
const glossaryItemRouter = require("./routers/glossaryRouter.js");
const treeRouter = require("./routers/treeRouter.js");
const articleRouter = require("./routers/articleRouter.js");

// Dotenv access
require("dotenv").config();
const port = process.env.PORT;
const mongoUser = process.env.DB_USER;
const mongoPassword = process.env.PASSWORD;
const mongoDB = process.env.DATABASE;

// App configurations
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// App endpoints start here
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// User endpoints
app.use("/api", userRouter);

// Glossary endpoints
app.use("/api", glossaryItemRouter);

// Tree endpoints
app.use("/api", treeRouter);

// Article endpoints
app.use("/api", articleRouter);

// Connect to db
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.1anl6wt.mongodb.net/${mongoDB}?retryWrites=true&w=majority`;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB! Database: ${mongoDB}`);
    // Server start
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
