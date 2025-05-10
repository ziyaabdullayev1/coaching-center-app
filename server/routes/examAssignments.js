//server/routes/examAssignments.js
const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/examAssignmentsController");

// Assign a template to students
router.post("/", ctrl.assignTemplate);

// lookup by email (must come before /student/:student_id)
 router.get("/student", ctrl.getAssignmentsForStudentByEmail);

// Fetch assignments for one student
router.get("/student/:student_id", ctrl.getAssignmentsForStudent);

// **results** must come *before* the more general "/teacher/:teacher_id"
router.get(
  "/teacher/:teacher_id/results",
  ctrl.getResultsByTeacher
);

// keep your plain teacher-only lookup if you still need it
router.get(
  "/teacher/:teacher_id",
  ctrl.getAssignmentsForTeacher
);

router.post("/:id/feedback", ctrl.addAssignmentFeedback);

module.exports = router;
