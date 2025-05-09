const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/examAssignmentsController");

// Assign a template to students
router.post("/", ctrl.assignTemplate);

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

module.exports = router;
