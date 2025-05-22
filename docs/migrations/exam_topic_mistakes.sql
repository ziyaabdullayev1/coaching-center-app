-- Create a new table for storing topic-specific mistakes
CREATE TABLE IF NOT EXISTS public.exam_topic_mistakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL,
    lesson TEXT NOT NULL,
    topic TEXT NOT NULL,
    mistake_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add foreign key constraints if the related tables exist
    CONSTRAINT fk_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exam_topic_mistakes_exam_id ON public.exam_topic_mistakes(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_topic_mistakes_lesson ON public.exam_topic_mistakes(lesson);
CREATE INDEX IF NOT EXISTS idx_exam_topic_mistakes_topic ON public.exam_topic_mistakes(topic);

-- Create a function and trigger to update a summary table if needed in the future
-- For now, this is just a placeholder for future extensions
-- 
-- CREATE OR REPLACE FUNCTION update_student_topic_summary()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- Update a summary table with aggregated statistics
--     -- This would be implemented if a student-topic summary table exists
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- 
-- CREATE TRIGGER after_exam_topic_mistake_change
-- AFTER INSERT OR UPDATE OR DELETE ON public.exam_topic_mistakes
-- FOR EACH ROW EXECUTE FUNCTION update_student_topic_summary(); 