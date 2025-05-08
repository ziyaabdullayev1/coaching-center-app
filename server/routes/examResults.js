// server/routes/examResults.js
const express = require("express");
const router = express.Router();
const examResultsController = require("../controllers/examResultsController");

// GET    /api/exam-results
router.get("/", examResultsController.getAllResults);

// GET    /api/exam-results/student/:student_id
router.get("/student/:student_id", examResultsController.getResultsByStudent);

// POST   /api/exam-results
router.post("/", examResultsController.addResult);

module.exports = router;
