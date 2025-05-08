// server/controllers/examResultsController.js
const examResultsService = require("../services/examResultsService");

exports.getAllResults = async (req, res) => {
  const { data, error } = await examResultsService.getAllResults();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.getResultsByStudent = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await examResultsService.getResultsByStudentId(student_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.addResult = async (req, res) => {
  const result = req.body;
  const { data, error } = await examResultsService.createResult(result);
  if (error) return res.status(400).json({ error: error.message });
  // insert + select() ile dönen dizi içindeki ilk öğeyi yollayalım
  res.status(201).json(data[0]);
};
