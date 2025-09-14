import React, { useEffect, useState } from "react";
import { Home, FileText, Clock, Settings, User, ChevronRight } from "lucide-react";

function Sidebar({ activeSection, setActiveSection }) {
  const [user, setUser] = useState({ name: "John Doe", email: "", initials: "JD" });

  useEffect(() => {
    // Retrieve user info from localStorage after login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const initials = parsedUser.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
      setUser({ name: parsedUser.name, email: parsedUser.email, initials });
    }
  }, []);

  const navItems = [
    { id: "home", label: "Dashboard", icon: Home, color: "text-blue-400" },
    { id: "past", label: "Past Interviews", icon: Clock, color: "text-green-400" },
    { id: "resume", label: "My Resume", icon: FileText, color: "text-purple-400" },
    { id: "settings", label: "Settings", icon: Settings, color: "text-orange-400" },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Candidate Panel</h2>
            <p className="text-sm text-gray-400">Interview Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
        </div>

        {navItems.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              activeSection === id
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                : "hover:bg-gray-700 hover:bg-opacity-50 text-gray-300 hover:text-white hover:transform hover:scale-[1.01]"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg mr-4 transition-colors duration-200 ${
                  activeSection === id
                    ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30"
                    : "bg-gray-700 bg-opacity-50 group-hover:bg-gray-600 group-hover:bg-opacity-60"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    activeSection === id
                      ? "text-white"
                      : `${color} group-hover:${color.replace("text-", "text-")} group-hover:brightness-110`
                  }`}
                />
              </div>
              <span className="font-medium">{label}</span>
            </div>

            <ChevronRight
              className={`w-4 h-4 transition-all duration-200 ${
                activeSection === id
                  ? "text-white opacity-100 transform rotate-90"
                  : "text-gray-500 opacity-0 group-hover:opacity-60"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-6 border-t border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-750 border border-gray-600 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{user.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user.name}</p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Profile Strength</span>
              <span className="text-green-400 font-medium">80%</span>
            </div>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-4/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500">© 2025 CodeCollab Interview Platform</p>
          <p className="text-xs text-gray-600 mt-1">Version 2.0.1</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
