# Topic-Specific Mistakes Tracking Feature

This document explains the new feature for tracking topic-specific mistakes in student exams.

## Overview

The topic-specific mistakes tracking feature allows teachers to assign wrong and blank answers to specific topics within a subject (lesson). This provides more detailed data about where students are struggling.

For example, in a Math exam with 30 questions, if a student has 26 correct, 2 wrong, and 2 blank, the teacher can specify which topics (e.g., "Calculus", "Derivatives", "Integrals") these mistakes belong to.

## Database Setup

Before using this feature, you need to run the database migration to create the necessary table:

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Run the SQL commands found in `docs/migrations/exam_topic_mistakes.sql`

## Usage

### As a Teacher

1. Navigate to the exam results page
2. For any lesson where the student has wrong or blank answers, you'll see a "Konu Bazlı Hataları Göster" (Show Topic-Based Mistakes) button
3. Click this button to open the topic mistakes tracker
4. Add topics by clicking the "Yeni Konu Ekle" (Add New Topic) button
5. Enter the name of the topic and click "Ekle" (Add)
6. Distribute the wrong/blank answers among the topics using the number inputs
7. The progress bar shows how many mistakes have been allocated out of the total
8. When all mistakes are allocated, click "Kaydet" (Save)

### Viewing Topic Mistake Reports

Currently, the feature supports:

- Recording topic-specific mistakes for each exam
- Retrieving all topic mistakes for a specific exam
- Retrieving all topic mistakes for a specific student
- Getting a summary of topic mistakes for a student

## API Endpoints

The following API endpoints are available:

- `POST /api/exam-results/topic-mistakes` - Save topic mistakes for an exam
- `GET /api/exam-results/topic-mistakes/exam/:examId` - Get topic mistakes for a specific exam
- `GET /api/exam-results/topic-mistakes/student/:studentId` - Get all topic mistakes for a student
- `GET /api/exam-results/topic-mistakes/student/:studentId/summary` - Get a summary of topic mistakes for a student

## Data Structure

The topic mistakes are stored in the `exam_topic_mistakes` table with the following structure:

- `id` - UUID primary key
- `exam_id` - Reference to the exam
- `lesson` - The subject (e.g., "Math", "Science")
- `topic` - The specific topic (e.g., "Integrals", "Newton's Laws")
- `mistake_count` - Number of mistakes for this topic
- `created_at` - Timestamp

## Future Enhancements

Possible future enhancements include:

1. Topic mistake summary visualizations in student dashboard
2. Automatic topic suggestion based on textbook/curriculum
3. Recommendations for study materials based on topic mistake patterns
4. School-wide or class-wide topic difficulty analytics 