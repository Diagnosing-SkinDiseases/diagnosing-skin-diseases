const express = require("express");
const glossaryRouter = express.Router();

// Create
glossaryRouter.post("/glossary/create", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let term;
  if (isEmpty) {
    term = "Empty";
  } else {
    term = req.body.term;
  }
  console.log(term);
  res.send(`Create: ${term}`);
});

// Read
glossaryRouter.get("/glossary/read", (req, res) => {
  let response = req.query.term ? `${req.query.term}!` : "unknown";
  res.send(`Read: ${response}`);
});

// Update
glossaryRouter.patch("/glossary/update", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let term;
  if (isEmpty) {
    term = "Empty";
  } else {
    term = req.body.term;
  }
  console.log(term);
  res.send(`Update: ${term}`);
});

// Delete
glossaryRouter.delete("/glossary/delete", (req, res) => {
  const isEmpty = Object.keys(req.body).length === 0;
  console.log(req.body);
  let term;
  if (isEmpty) {
    term = "Empty";
  } else {
    term = req.body.term;
  }
  console.log(term);
  res.send(`Delete: ${term}`);
});

module.exports = glossaryRouter;
