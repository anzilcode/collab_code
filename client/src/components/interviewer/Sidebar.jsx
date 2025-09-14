import { Home, Users, Calendar, MessageSquare, FileText, Settings, Briefcase, User } from "lucide-react";
import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare },
    { id: "questions", label: "Questions", icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "Interviewer";

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">InterviewPro</h1>
            <p className="text-sm text-slate-400">Talent Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium truncate">{userName}</p>
            <p className="text-sm text-slate-400 truncate">Senior Recruiter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
