/**
 * Save topic mistakes for a specific exam and lesson
 * @param {Object} data - Object containing examId, lesson, and topicMistakes
 * @returns {Promise<Object>} - Response from the API
 */
export const saveTopicMistakes = async (data) => {
  try {
    const response = await fetch('/api/exam-results/topic-mistakes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving topic mistakes:', error);
    throw error;
  }
};

/**
 * Get topic mistakes for a specific exam
 * @param {string} examId - The ID of the exam
 * @returns {Promise<Array>} - Array of topic mistakes
 */
export const getTopicMistakesByExamId = async (examId) => {
  try {
    const response = await fetch(`/api/exam-results/topic-mistakes/exam/${examId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching topic mistakes by exam ID:', error);
    throw error;
  }
};

/**
 * Get topic mistakes summary for a student
 * @param {string} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of topic mistake summaries
 */
export const getTopicMistakesSummaryByStudentId = async (studentId) => {
  try {
    const response = await fetch(`/api/exam-results/topic-mistakes/student/${studentId}/summary`);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching topic mistakes summary by student ID:', error);
    throw error;
  }
}; 