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
} = require("../controllers/foroController");

//Routes to the API request
router.post("/new", addQuestion); //Create Foro
router.get("/", getForos); //List Foro
router.get("/seeForo/:id", getForo); // get Foro info
router.patch("/:id", updateForo); //Update Foro
router.put("/delete/:id", deleteForo); //Delete Foro

module.exports = router;
