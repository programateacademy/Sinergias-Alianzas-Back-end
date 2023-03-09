//import express
const express = require("express");
//Router: Used for add more pages to or aplication
const router = express.Router();

const {addAnswer, updateAnswer, deleteAnswer} = require("../controllers/answerController")
//Get functionality from controller
const {
    addQuestion,
    getForos,
    getForo,
    updateForo,
    deleteForo,
} = require("../controllers/foroController");

//Routes to the API request
router.post("/", addQuestion); //Create Component
router.get("/", getForos); //List Component
router.get("/:id", getForo); // get component info
router.patch("/", updateForo); //Update Component
router.put("/", deleteForo); //Delete Component

// Routes answers
router.post("/", addAnswer);
router.patch("/", updateAnswer);
router.put("/", deleteAnswer);
module.exports = router;
