
const examTemplateService = require("../services/examTemplateService");

// GET /api/exam-templates
exports.getAllTemplates = async (req, res) => {
  const { data, error } = await examTemplateService.getAllTemplates();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/exam-templates/teacher/:teacher_id
exports.getTemplatesByTeacherId = async (req, res) => {
  const teacherId = req.params.teacher_id;
  const { data, error } = await examTemplateService.getTemplatesByTeacherId(
    teacherId
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/exam-templates
exports.addTemplate = async (req, res) => {
  const { teacher_id, name, date, lessons } = req.body;

  if (!teacher_id) {
    return res.status(400).json({ error: "teacher_id is required" });
  }

  // 1) Şablonu oluştur
  const { data: tpl, error: tplErr } = await examTemplateService.createTemplate({
    teacher_id,
    name,
    date,
  });
  if (tplErr) return res.status(500).json({ error: tplErr.message });

  // 2) Şablona bağlı dersleri oluştur
  const lessonsToInsert = lessons.map((l) => ({
    template_id: tpl[0].id,
    lesson: l.lesson,
    question_count: l.question_count,
  }));
  const { error: lessErr } =
    await examTemplateService.createTemplateLessons(lessonsToInsert);
  if (lessErr) return res.status(500).json({ error: lessErr.message });

  res.status(201).json(tpl[0]);
};

// PUT /api/exam-templates/:id
exports.updateTemplate = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const { data, error } = await examTemplateService.updateTemplate(
    id,
    updatedData
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/exam-templates/:id
exports.deleteTemplate = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await examTemplateService.deleteTemplate(id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Template deleted successfully", data });
};