import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RoleSelection() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    if (role === "student") navigate("/dashboard/student");
    else if (role === "teacher") navigate("/dashboard/teacher");
    else if (role === "coach") navigate("/dashboard/coach");
  };

  return (
    <div className="auth-card">
      <h2>Select Your Role</h2>
      <form onSubmit={handleContinue}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{ padding: "0.75rem", borderRadius: "8px", fontSize: "1rem", marginBottom: "1rem", width: "100%" }}
        >
          <option value="" disabled>Select role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="coach">Coach</option>
        </select>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
