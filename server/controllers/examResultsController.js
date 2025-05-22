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

// These appear to be duplicates or might have been added in error in the routes file
exports.getExamResults = exports.getAllResults;
exports.addExamResult = exports.addResult;

// New function to save topic-specific mistakes
exports.saveTopicMistakes = async (req, res) => {
  try {
    const { examId, lesson, topicMistakes } = req.body;
    
    if (!examId) {
      return res.status(400).json({ error: "examId is required" });
    }
    
    if (!lesson) {
      return res.status(400).json({ error: "lesson is required" });
    }
    
    if (!topicMistakes || typeof topicMistakes !== 'object') {
      return res.status(400).json({ error: "topicMistakes must be an object" });
    }
    
    // Convert topic mistakes object to array of entries for database
    const topicMistakesArray = Object.entries(topicMistakes).map(([topic, count]) => ({
      exam_id: examId,
      lesson,
      topic,
      mistake_count: count
    }));
    
    // First, delete any existing topic mistakes for this exam + lesson
    await examResultsService.deleteTopicMistakes(examId, lesson);
    
    // Then insert the new ones if there are any
    if (topicMistakesArray.length > 0) {
      const { data, error } = await examResultsService.saveTopicMistakes(topicMistakesArray);
      
      if (error) {
        console.error("Error saving topic mistakes:", error);
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(201).json({ 
        success: true, 
        message: `Saved ${topicMistakesArray.length} topic mistake entries`,
        data 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "No topic mistakes to save" 
    });
    
  } catch (error) {
    console.error("Error in saveTopicMistakes:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// New function to get topic mistakes by exam ID
exports.getTopicMistakesByExamId = async (req, res) => {
  try {
    const { examId } = req.params;
    
    if (!examId) {
      return res.status(400).json({ error: "examId is required" });
    }
    
    const { data, error } = await examResultsService.getTopicMistakesByExamId(examId);
    
    if (error) {
      console.error("Error fetching topic mistakes by exam ID:", error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (err) {
    console.error("Server error in getTopicMistakesByExamId:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// New function to get topic mistakes by student ID
exports.getTopicMistakesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    
    const { data, error } = await examResultsService.getTopicMistakesByStudentId(studentId);
    
    if (error) {
      console.error("Error fetching topic mistakes by student ID:", error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (err) {
    console.error("Server error in getTopicMistakesByStudentId:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// New function to get topic mistakes summary by student ID
exports.getTopicMistakesSummaryByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }
    
    const { data, error } = await examResultsService.getTopicMistakesSummaryByStudentId(studentId);
    
    if (error) {
      console.error("Error fetching topic mistakes summary:", error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (err) {
    console.error("Server error in getTopicMistakesSummaryByStudentId:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
