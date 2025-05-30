const express = require('express');
const router = express.Router();
const studentsRouter = require('./students');
const examTopicMistakesRouter = require('./examTopicMistakes');

// Mount routes
router.use('/students', studentsRouter);
router.use('/exam-topic-mistakes', examTopicMistakesRouter);

module.exports = router; 