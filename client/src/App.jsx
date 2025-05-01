import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentsPage from "./pages/StudentsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import RoleSelection from './pages/RoleSelection';
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CoachDashboard from "./pages/CoachDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentList from "./pages/StudentList";
import GoalList from "./pages/GoalList";
import TaskPage from "./pages/TaskPage";
import StudentTasksPage from "./pages/StudentTasksPage";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/role" element={<RoleSelection />} />
      <Route path="/students" element={<StudentList />} />
      <Route
  path="/dashboard/student"
  element={
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/teacher"
  element={
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/coach"
  element={
    <ProtectedRoute allowedRoles={["coach"]}>
      <CoachDashboard />
    </ProtectedRoute>
  }
/>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
  path="/dashboard/coach/students"
  element={
    <ProtectedRoute allowedRoles={["coach"]}>
      <StudentList />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/teacher/goals"
  element={
    <ProtectedRoute allowedRoles={["teacher", "coach"]}>
      <GoalList />
    </ProtectedRoute>
  }
/>
<Route
  path="/dashboard/teacher/tasks"
  element={
    <ProtectedRoute allowedRoles={["teacher", "coach"]}>
      <TaskPage />
    </ProtectedRoute>
  }
/>
<Route path="/dashboard/student/tasks" element={<StudentTasksPage />} />
    </Routes>
    
  );
}


export default App;
