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
router.post("/new", addQuestion); //Create Component
router.get("/", getForos); //List Component
router.get("/seeForo", getForo); // get component info
router.patch("/", updateForo); //Update Component
router.put("/delete", deleteForo); //Delete Component

// Routes answers
router.post("/newAnswer", )
module.exports = router;
