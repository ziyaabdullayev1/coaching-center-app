// server/routes/examAssignments.js
const express = require("express");
const router  = express.Router();
// Burada alias’ı değiştirip assignmentsController dedik:
const assignmentsController = require("../controllers/examAssignmentsController");

// Assign a template to one or more students
router.post(
  "/",
  assignmentsController.assignTemplate
);

// Fetch a specific student’s assignments
router.get(
  "/student/:student_id",
  assignmentsController.getAssignmentsForStudent
);

// NEW: fetch *all* assignments + their results for this teacher
router.get(
  "/teacher/:teacher_id/results",
  assignmentsController.getResultsByTeacher
);

module.exports = router;
