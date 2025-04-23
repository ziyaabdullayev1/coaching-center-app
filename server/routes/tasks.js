const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

router.get("/", tasksController.getTasks);
router.post("/", tasksController.addTask);
router.put("/:id", tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);
router.get("/goal/:goal_id", tasksController.getTasksByGoal);

module.exports = router;
