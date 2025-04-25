import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // ✅ login fonksiyonu alındı

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }, // metadata olarak rol gönderiyoruz
      },
    });
  
    if (error) {
      alert(error.message);
      return;
    }
  
    // Kullanıcı kaydolduysa login ve yönlendirme
    login({ email, role });
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "8px",
            fontSize: "1rem",
            width: "100%",
          }}
        >
          <option value="">Select role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="coach">Coach</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
