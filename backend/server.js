const express = require("express");
const app = express();
const port = 3000;
const userRouter = require("./routers/userRouter.js");

// App configurations
app.use(express.json());

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Post test");
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// User endpoints
app.use("/api", userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
