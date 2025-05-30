const API_BASE_URL = "http://localhost:3001/api";

export const fetchTopicMistakesForStudent = async (studentEmail) => {
  try {
    // First get all exams for the student
    const examsResponse = await fetch(`${API_BASE_URL}/students/email/${studentEmail}/exams`);
    if (!examsResponse.ok) {
      const error = await examsResponse.json();
      throw new Error(error.error || 'Failed to fetch exams');
    }
    
    const exams = await examsResponse.json();
    if (!Array.isArray(exams)) {
      console.error('Expected array of exams but got:', exams);
      return [];
    }

    // For each exam, fetch its topic mistakes
    const examMistakesPromises = exams.map(async (exam) => {
      try {
        const mistakesResponse = await fetch(`${API_BASE_URL}/exam-topic-mistakes/${exam.id}`);
        const mistakes = await mistakesResponse.json();
        
        // Log the mistakes data for debugging
        console.log(`Mistakes for exam ${exam.id}:`, mistakes);
        
        return {
          ...exam,
          topic_mistakes: Array.isArray(mistakes) ? mistakes.map(m => ({
            lesson: m.lesson || exam.lesson || 'Diğer',
            topic: m.topic,
            mistake_count: m.mistake_count
          })) : []
        };
      } catch (error) {
        console.warn(`Error fetching mistakes for exam ${exam.id}:`, error);
        return {
          ...exam,
          topic_mistakes: []
        };
      }
    });

    const examsWithMistakes = await Promise.all(examMistakesPromises);
    
    // Filter out exams with no mistakes
    const examsWithActualMistakes = examsWithMistakes.filter(exam => 
      exam.topic_mistakes && exam.topic_mistakes.length > 0
    );

    // Log the final data for debugging
    console.log('Final exams with mistakes:', examsWithActualMistakes);

    return examsWithActualMistakes;
  } catch (error) {
    console.error("Error fetching topic mistakes:", error);
    throw new Error("Konu bazlı hataları getirirken bir sorun oluştu");
  }
}; 