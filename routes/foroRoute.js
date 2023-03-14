//import express
const express = require("express");
//Router: Used for add more pages to or aplication
const router = express.Router();

//Get functionality from controller
const {
  addQuestion,
  getForos,
  getForo,
  updateForo,
  deleteForo,
  updateLikeQuestion,
  updateReportQuestion,
  getReports
} = require("../controllers/foroController");

//GET
router.get("/", getForos); //List foro
router.get("/seeForo/:id", getForo); // Get foro info
router.get("/reports", getReports); // Get foro info
//POST
router.post("/", addQuestion); //Create foro
//PUT AND PATCH
router.patch("/", updateForo); //Update foro
router.put("/", deleteForo); //Delete foro

// OPTIONS - LIKE AND REPORT QUESTION
router.put("/updateNumberLike", updateLikeQuestion);
router.put("/updateReport", updateReportQuestion);


module.exports = router;
