// server/routes/examTemplates.js
const express = require("express");
const router = express.Router();
const examTemplatesController = require("../controllers/examTemplatesController");

// GET    /api/exam-templates
router.get("/", examTemplatesController.getAllTemplates);

// GET    /api/exam-templates/teacher/:teacher_id
router.get(
  "/teacher/:teacher_id",
  examTemplatesController.getTemplatesByTeacherId
);

// POST   /api/exam-templates
router.post("/", examTemplatesController.addTemplate);

// PUT    /api/exam-templates/:id
router.put("/:id", examTemplatesController.updateTemplate);

// DELETE /api/exam-templates/:id
router.delete("/:id", examTemplatesController.deleteTemplate);

module.exports = router;
