const express = require("express");
const router = express.Router();
const examsController = require("../controllers/examsController");

router.get("/", examsController.getExams);
router.post("/", examsController.addExam);
router.put("/:id", examsController.updateExam);
router.delete("/:id", examsController.deleteExam);
router.get("/student/:student_id/summary", examsController.getExamSummary);
router.get("/student/:student_id/average", examsController.getAverageByLesson);
router.get("/student/:student_id/progress", examsController.getProgress);
router.get("/student/:student_id", examsController.getExamsByStudent);


module.exports = router;
