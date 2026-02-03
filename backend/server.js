// Dotenv access
require("dotenv").config();

// Module imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routers
const userRouter = require("./routers/userRouter.js");
const glossaryItemRouter = require("./routers/glossaryRouter.js");
const treeRouter = require("./routers/treeRouter.js");
const articleRouter = require("./routers/articleRouter.js");
const authRouter = require("./routers/authRouter.js");
const responseUrlRewrite = require("./middleware/responseUrlRewrite.js");

// Environment variables
const port = process.env.PORT;
const mongoUser = process.env.DB_USER;
const mongoPassword = process.env.PASSWORD;
const mongoDB = process.env.DATABASE;

// Parse allowed origins from env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

// App configurations
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Insomnia, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

// ✅ GLOBAL URL REWRITE (TESTING)
// app.use(responseUrlRewrite);

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

// Auth endpoints
app.use("/api", authRouter);

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
    console.error(error);
  });
