import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav
      style={{
        backgroundColor: "#1e3a8a",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>Coaching App</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {user && <span>{user.email}</span>}
        <LogoutButton />
      </div>
    </nav>
  );
}
