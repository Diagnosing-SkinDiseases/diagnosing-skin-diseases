const express = require("express");
const articleRouter = express.Router();

// Create
articleRouter.post("/article/create", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let title;
  if (isEmpty) {
    title = "Empty";
  } else {
    title = req.body.title;
  }
  console.log(title);
  res.send(`Create: ${title}`);
});

// Read
articleRouter.get("/article/read", (req, res) => {
  let response = req.query.title ? `${req.query.title}!` : "unknown";
  res.send(`Read: ${response}`);
});

// Update
articleRouter.patch("/article/update", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let title;
  if (isEmpty) {
    title = "Empty";
  } else {
    title = req.body.title;
  }
  console.log(title);
  res.send(`Update: ${title}`);
});

// Delete
articleRouter.delete("/article/delete", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let title;
  if (isEmpty) {
    title = "Empty";
  } else {
    title = req.body.title;
  }
  console.log(title);
  res.send(`Delete: ${title}`);
});

module.exports = articleRouter;
