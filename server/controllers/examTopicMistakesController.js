const supabase = require("../services/supabaseClient");

// Get topic mistakes for a specific exam
exports.getExamTopicMistakes = async (req, res) => {
  const { examId } = req.params;

  if (!examId) {
    return res.status(400).json({ error: "Exam ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("exam_topic_mistakes")
      .select("*")
      .eq("exam_id", examId);

    if (error) {
      console.error("Error fetching topic mistakes:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error("Server error in getExamTopicMistakes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create topic mistakes for an exam
exports.createExamTopicMistakes = async (req, res) => {
  const { examId } = req.params;
  const mistakes = req.body;

  if (!examId || !Array.isArray(mistakes)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const { data, error } = await supabase
      .from("exam_topic_mistakes")
      .insert(
        mistakes.map(m => ({
          exam_id: examId,
          lesson: m.lesson,
          topic: m.topic,
          mistake_count: m.mistake_count
        }))
      );

    if (error) {
      console.error("Error creating topic mistakes:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Server error in createExamTopicMistakes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update topic mistakes for an exam
exports.updateExamTopicMistakes = async (req, res) => {
  const { examId } = req.params;
  const mistakes = req.body;

  if (!examId || !Array.isArray(mistakes)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    // Delete existing mistakes for this exam
    await supabase
      .from("exam_topic_mistakes")
      .delete()
      .eq("exam_id", examId);

    // Insert new mistakes
    const { data, error } = await supabase
      .from("exam_topic_mistakes")
      .insert(
        mistakes.map(m => ({
          exam_id: examId,
          lesson: m.lesson,
          topic: m.topic,
          mistake_count: m.mistake_count
        }))
      );

    if (error) {
      console.error("Error updating topic mistakes:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error in updateExamTopicMistakes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}; 