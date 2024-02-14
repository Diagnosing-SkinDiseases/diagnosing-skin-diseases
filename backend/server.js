const express = require("express");
const app = express();
const port = 3000;
const userRouter = require("./routers/userRouter.js");
const glossaryRouter = require("./routers/glossaryRouter.js");

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

// Server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
