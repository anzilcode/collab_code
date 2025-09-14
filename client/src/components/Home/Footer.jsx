import { Link, useNavigate } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../../Context/AuthContext"; 

const Footer = () => {
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
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand / About */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">CodeCollab</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Run real-time coding interviews with built-in video, chat, 
              and a powerful collaborative editor — all in one platform. 
              Streamline your technical hiring process with our comprehensive solution.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@codecollab.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 9745 6655 63</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Kerala, India</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#testimonials" className="hover:text-blue-400 transition-colors">Rating</a></li>
              <li><Link to='/info' className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Account & Legal</h3>
            <ul className="space-y-3">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to={dashboardPath} className="hover:text-blue-400 transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="hover:text-blue-400 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth?mode=login" className="hover:text-blue-400 transition-colors">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth?mode=register" className="hover:text-blue-400 transition-colors">
                      Get Started
                    </Link>
                  </li>
                </>
              )}
              <li><Link to="/info?section=privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/info?section=terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/info?section=support" className="hover:text-blue-400 transition-colors">Support Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-slate-800 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h4 className="text-white font-semibold">Follow Us</h4>
            <div className="flex gap-6">
              <a href="https://github.com/codecollab-official" target="_blank" rel="noopener noreferrer"
                 className="hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/codecollab_io" target="_blank" rel="noopener noreferrer"
                 className="hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/codecollab" target="_blank" rel="noopener noreferrer"
                 className="hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-full">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CodeCollab. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
