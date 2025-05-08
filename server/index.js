const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);


const goalRoutes = require("./routes/goals");
app.use("/api/goals", goalRoutes);

const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);

const examRoutes = require("./routes/exams");
app.use("/api/exams", examRoutes);

const teacherRoutes = require("./routes/teachers");
app.use("/api/teachers", teacherRoutes);

const examTemplateRoutes = require("./routes/examTemplates");
app.use("/api/exam-templates", examTemplateRoutes);

const examAssignmentRoutes = require("./routes/examAssignments");
app.use("/api/exam-assignments", examAssignmentRoutes);

const examResultsRoutes = require("./routes/examResults");
app.use("/api/exam-results", examResultsRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

