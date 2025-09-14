import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Info from "./pages/Info";
import AdminDashboard from "./pages/AdminDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import InterviewRoom  from './pages/Room/InterviewRoom'

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const roleRoutes = {
    admin: "/admin-dashboard",
    candidate: "/candidate-dashboard",
    interviewer: "/interviewer-dashboard",
  };

  return (
    <>
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/info" element={<Info />} />
        <Route path="/interview-room/:id" element={<InterviewRoom />} />

        {/* Protected Routes */}
        {token && role && (
          <Route
            path={roleRoutes[role]}
            element={
              role === "admin" ? (
                <AdminDashboard />
              ) : role === "candidate" ? (
                <CandidateDashboard />
              ) : (
                <InterviewerDashboard />
              )
            }
          />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
