const express = require("express");
const treeRouter = express.Router();

// Create
treeRouter.post("/tree/create", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let name;
  if (isEmpty) {
    name = "Empty";
  } else {
    name = req.body.name;
  }
  console.log(name);
  res.send(`Create: ${name}`);
});

// Read
treeRouter.get("/tree/read", (req, res) => {
  let response = req.query.name ? `${req.query.name}!` : "unknown";
  res.send(`Read: ${response}`);
});

// Update
treeRouter.patch("/tree/update", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let name;
  if (isEmpty) {
    name = "Empty";
  } else {
    name = req.body.name;
  }
  console.log(name);
  res.send(`Update: ${name}`);
});

// Delete
treeRouter.delete("/tree/delete", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let name;
  if (isEmpty) {
    name = "Empty";
  } else {
    name = req.body.name;
  }
  console.log(name);
  res.send(`Delete: ${name}`);
});

module.exports = treeRouter;
