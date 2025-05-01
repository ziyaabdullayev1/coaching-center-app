import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (e) => {
    setRole(e.target.value);
    setStep(2);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log("Signing up as:", role);
    // --- 1) Supabase Auth signup ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });
    if (error) return alert("Signup Error: " + error.message);

    const user = data.user;
    console.log("Got user.id:", user.id);

    // --- 2) Rol bazlı kaydetme ---
    let insertError = null;
    if (role === "student") {
      ({ error: insertError } = await supabase
        .from("students")
        .insert({ name: fullName, email: user.email, grade }));
    } else if (role === "teacher") {
      ({ error: insertError } = await supabase
        .from("teachers")
        .insert({ name: fullName, email: user.email }));
    } else if (role === "coach") {
      ({ error: insertError } = await supabase
        .from("coaches")
        .insert({ name: fullName, email: user.email }));
    }
    if (insertError) {
      console.error("Insert Error:", insertError);
      return alert("DB Insert Error: " + insertError.message);
    }

    // --- 3) Login & yönlendir ---
    login({ id: user.id, email: user.email, role });
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>

      {step === 1 ? (
        /* STEP 1: Role seçimi */
        <div>
          <label>Select Role:</label>
          <select
            value={role}
            onChange={handleRoleSelect}
            style={{ display: "block", margin: "1rem 0", padding: "0.5rem" }}
          >
            <option value="">-- Select role --</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="coach">Coach</option>
          </select>
        </div>
      ) : (
        /* STEP 2: Geri kalan form */
        <form onSubmit={handleSignup}>
          <p>Role: <strong>{role}</strong></p>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {/* sadece student için */}
          {role === "student" && (
            <input
              type="text"
              placeholder="Grade (e.g., 6th, 7th)"
              value={grade}
              onChange={e => setGrade(e.target.value)}
              required
            />
          )}

          <button type="submit" style={{ marginTop: "1rem" }}>
            Sign Up
          </button>
        </form>
      )}

      {step === 2 && (
        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      )}
    </div>
  );
}
