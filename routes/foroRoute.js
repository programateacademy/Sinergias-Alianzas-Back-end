//import express
const express = require("express");
//Router: Used for add more pages to or aplication
const router = express.Router();

//Get functionality from controller
const {
  addQuestion,
  getForo,
  updateForo,
  deleteForo,
  updateLikeQuestion,
  updateReportQuestion,
  getReports
} = require("../controllers/foroController");

//GET
router.get("/:id", getForo); // Get foro info ---FUNCIONA
router.get("/", getReports); // Get foro info ---FUNCIONA
//POST
router.post("/:id", addQuestion); //Create foro
//PUT AND PATCH
router.patch("/", updateForo); //Update foro ---FUNCIONA
router.put("/", deleteForo); //Delete foro ---FUNCIONA

// OPTIONS - LIKE AND REPORT QUESTION 
router.put("/updateNumberLike", updateLikeQuestion); // ---FUNCIONA
router.put("/updateReport", updateReportQuestion); // ---FUNCIONA


module.exports = router;
