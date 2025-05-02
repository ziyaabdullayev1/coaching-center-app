// routes/students.js
const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentsController");

router.get("/", studentsController.getStudents);
router.post("/", studentsController.addStudent);
router.put("/:id", studentsController.updateStudent);     // PUT
router.delete("/:id", studentsController.deleteStudent); // DELETE
router.get("/email/:email", studentsController.getStudentByEmail);

module.exports = router;
