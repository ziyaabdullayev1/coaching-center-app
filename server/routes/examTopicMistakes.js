const express = require("express");
const router = express.Router();
const supabase = require("../services/supabaseClient");

// Get topic mistakes for a specific exam
router.get("/:examId", async (req, res) => {
  const { examId } = req.params;

  if (!examId) {
    return res.status(400).json({ error: "Exam ID is required" });
  }

  try {
    console.log('Fetching mistakes for exam:', examId);
    const { data, error } = await supabase
      .from("exam_topic_mistakes")
      .select("id, exam_id, lesson, topic, mistake_count")
      .eq("exam_id", examId);

    if (error) {
      console.error("Error fetching topic mistakes:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Found mistakes:', data);
    res.json(data || []);
  } catch (err) {
    console.error("Server error in getExamTopicMistakes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create topic mistakes for an exam
router.post("/:examId", async (req, res) => {
  const { examId } = req.params;
  const mistakes = req.body;

  try {
    console.log('Creating mistakes for exam:', examId, 'Data:', mistakes);

    if (!examId || !Array.isArray(mistakes)) {
      console.error('Invalid request data:', { examId, mistakes });
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { data, error } = await supabase
      .from("exam_topic_mistakes")
      .insert(
        mistakes.map(m => ({
          exam_id: examId,
          lesson: m.lesson,
          topic: m.topic,
          mistake_count: m.mistake_count
        }))
      )
      .select();

    if (error) {
      console.error("Error creating topic mistakes:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Successfully created mistakes:', data);
    res.status(201).json(data);
  } catch (err) {
    console.error("Server error in createExamTopicMistakes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update topic mistakes for an exam
router.put("/:examId", async (req, res) => {
  const { examId } = req.params;
  const mistakes = req.body;

  if (!examId || !Array.isArray(mistakes)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    // Delete existing mistakes for this exam
    const { error: deleteError } = await supabase
      .from("exam_topic_mistakes")
      .delete()
      .eq("exam_id", examId);

    if (deleteError) {
      console.error("Error deleting existing mistakes:", deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

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
      )
      .select();

    if (error) {
      console.error("Error updating topic mistakes:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server error in updateExamTopicMistakes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router; 