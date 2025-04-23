// routes/goals.js
const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goalsController");

router.get("/", goalsController.getGoals);
router.post("/", goalsController.addGoal);
router.put("/:id", goalsController.updateGoal);         
router.delete("/:id", goalsController.deleteGoal);     
router.get("/student/:student_id", goalsController.getGoalsByStudent);

module.exports = router;
