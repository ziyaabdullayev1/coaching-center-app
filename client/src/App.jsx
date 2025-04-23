import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentsPage from "./pages/StudentsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/students" element={<StudentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
