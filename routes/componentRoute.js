//import express
const express = require("express");
//Router: Used for add more pages to or aplication
const router = express.Router();

//Get functionality from controller
const {
  addComponent,
  getComponents,
  updateComponent,
  deleteComponent,
  getComponent,
} = require("../controllers/componentController");

//Routes to the API request
router.post("/new", addComponent); //Create Component
router.get("/", getComponents); //List Component
router.get("/seeComponent/:id", getComponent); // get component info
router.patch("/:id", updateComponent); //Update Component
router.put("/delete/:id", deleteComponent); //Delete Component

module.exports = router;
