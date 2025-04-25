import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem" }}>{children}</main>
    </>
  );
}
