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

// Tüm sınav sonuçları
router.get("/", examResultsController.getExamResults);

// Yeni sınav sonucu ekle
router.post("/", examResultsController.addExamResult);

// Sınav-konu bazlı hataları kaydet
router.post("/topic-mistakes", examResultsController.saveTopicMistakes);

// Belirli bir sınavın konu bazlı hatalarını getir
router.get("/topic-mistakes/exam/:examId", examResultsController.getTopicMistakesByExamId);

// Belirli bir öğrencinin konu bazlı hatalarını getir
router.get("/topic-mistakes/student/:studentId", examResultsController.getTopicMistakesByStudentId);

// Belirli bir öğrenci için konu bazlı hataların özetini getir 
router.get("/topic-mistakes/student/:studentId/summary", examResultsController.getTopicMistakesSummaryByStudentId);

module.exports = router;
