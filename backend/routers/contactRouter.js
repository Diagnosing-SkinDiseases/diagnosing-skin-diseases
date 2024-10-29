const express = require("express");
const contactRouter = express.Router();
const { contactController } = require("../controllers/contactController");

// Route to handle contact form submission
contactRouter.post("/contact", contactController);

module.exports = contactRouter;
