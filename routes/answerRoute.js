const express = require("express");
//Router: Used for add more pages to or aplication
const router = express.Router();

const {
  addAnswer,
  updateAnswer,
  deleteAnswer,
  updateLikeAnswer,
  updateReportAnswer,
} = require("../controllers/answerController");


// Routes answers
router.post("/", addAnswer);
router.patch("/", updateAnswer);
router.put("/", deleteAnswer);
// Option answer
router.put("/updateNumberLike", updateLikeAnswer);
router.put("/updateReport", updateReportAnswer);

module.exports = router;