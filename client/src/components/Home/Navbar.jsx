import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth(); 
  const isLoggedIn = !!token;

  const handleLogout = () => {
    logout();     
    navigate("/");
  };

const roleRoutes = {
  admin: "/admin-dashboard",
  candidate: "/candidate-dashboard",
  interviewer: "/interviewer-dashboard",
};

const dashboardPath = role ? roleRoutes[role] : "/";

  return (
    <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl z-50 border-b border-slate-700/50 shadow-lg shadow-slate-900/20">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Code<span className="text-blue-400">Collab</span>
        </h1>
        <div className="space-x-8 hidden md:flex items-center">
          <a href="#home" className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>

          {isLoggedIn ? (
            <>
              <Link
                to={dashboardPath}
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-slate-800/50"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium px-3 py-1.5 rounded-md hover:bg-slate-800/50"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
