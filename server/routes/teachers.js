const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachersController");

// Tüm öğretmenleri getir
router.get("/", teachersController.getTeachers);

// Yeni öğretmen ekle
router.post("/", teachersController.addTeacher);

// Güncelle
router.put("/:id", teachersController.updateTeacher);

// Sil
router.delete("/:id", teachersController.deleteTeacher);

// Email'e göre öğretmen getir (Dashboard için)
router.get("/email/:email", teachersController.getTeacherByEmail);

// Öğretmene bağlı öğrencileri getir
router.get("/:id/students", teachersController.getTeacherStudents);

module.exports = router;
