import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  X,
  Calendar,
  CheckCircle,
  TrendingUp,
  Clock,
  User,
  Briefcase,
  RefreshCw,
  Video,
  AlertCircle,
  Building2,
  MoreVertical,
} from "lucide-react";

// InterviewCard Component
function InterviewCard({
  role,
  date,
  time,
  duration,
  status,
  companyName,
  location,
  interviewerName,
  roomId,
  onJoin,
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const parseDateTime = (date, time) => new Date(`${date}T${time}:00`);

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilStart = (startTime) => {
    const diff = startTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return "Starting now";
  };

  const getInterviewStatus = () => {
    if (!date || !time) return { label: "Unknown", color: "bg-gray-400", canJoin: false, priority: 5 };
    
    const start = parseDateTime(date, time);
    const durationMins = parseInt(duration) || 60;
    const end = new Date(start.getTime() + durationMins * 60000);
    const minutesUntilStart = Math.floor((start.getTime() - now.getTime()) / (1000 * 60));
    const minutesAfterStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));

    // Original join logic (within 15 min before start until interview ends)
    const isJoinAvailable = minutesUntilStart <= 15 && minutesUntilStart >= -parseInt(duration);

    if (now >= start && now <= end) {
      return { 
        label: "Live Now", 
        color: "bg-red-500 animate-pulse", 
        canJoin: isJoinAvailable,
        priority: 1,
        timeText: `${durationMins - minutesAfterStart}m remaining`
      };
    }

    if (minutesUntilStart <= 15 && minutesUntilStart > 0) {
      return { 
        label: "Starting Soon", 
        color: "bg-orange-500", 
        canJoin: isJoinAvailable,
        priority: 2,
        timeText: getTimeUntilStart(start)
      };
    }

    if (start.toDateString() === now.toDateString() && minutesUntilStart > 15) {
      return { 
        label: "Today", 
        color: "bg-blue-500", 
        canJoin: false,
        priority: 3,
        timeText: getTimeUntilStart(start)
      };
    }

    if (now < start) {
      return { 
        label: "Upcoming", 
        color: "bg-emerald-500", 
        canJoin: false,
        priority: 4,
        timeText: getTimeUntilStart(start)
      };
    }

    return { 
      label: "Completed", 
      color: "bg-gray-400", 
      canJoin: false, 
      expired: true,
      priority: 5
    };
  };

  const interviewStatus = getInterviewStatus();
  const isUrgent = interviewStatus.label === "Live Now" || interviewStatus.label === "Starting Soon";

  const getJoinButtonText = (status) => {
    if (status.label === "Live Now") return "Join Interview";
    if (status.label === "Starting Soon") return "Get Ready";
    return `Join Available at ${time}`;
  };

  return (
    <div
      className={`rounded-xl p-6 border transition-all duration-300 group ${
        isUrgent
          ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800 shadow-lg"
          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg"
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium text-white ${interviewStatus.color} flex items-center space-x-1`}
            >
              {interviewStatus.label === "Live Now" && <AlertCircle className="h-3 w-3" />}
              <span>{interviewStatus.label}</span>
            </div>
            {interviewStatus.timeText && (
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                isUrgent 
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}>
                {interviewStatus.timeText}
              </div>
            )}
          </div>

          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {role}
          </h4>

          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                {formatDateTime(date, time)} ({duration}m)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>{companyName} • {location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {interviewStatus.canJoin ? (
            <button
              onClick={() => onJoin(roomId)}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                interviewStatus.label === "Live Now"
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white animate-pulse"
                  : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
              }`}
            >
              <Video className="h-4 w-4" />
              <span>{getJoinButtonText(interviewStatus)}</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Interviewer Details
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {interviewerName || "TBD"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Position & Company
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {role} at {companyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('bg-', 'bg-')}/10`}>
          <Icon className={color.replace("bg-", "text-")} size={24} />
        </div>
      </div>
    </div>
  );
}

// DashboardHome Component
function DashboardHome() {
  const [stats, setStats] = useState({
    upcomingInterviews: 0,
    completedInterviews: 0,
    profileStrength: "0%",
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/interview/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [token]);

  // Fetch upcoming interviews
  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/interview/upcoming",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUpcomingInterviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching upcoming interviews:", err);
      setUpcomingInterviews([]);
    }
  }, [token]);


  useEffect(() => {
    fetchStats();
    fetchUpcoming();
  }, [fetchStats, fetchUpcoming]);

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      console.log("Joining room:", roomId);
      setShowJoinModal(false);
      setRoomId("");
    }
  };

  const closeModal = () => {
    setShowJoinModal(false);
    setRoomId("");
  };

  const statCards = [
    {
      label: "Upcoming Interviews",
      value: stats.upcomingInterviews,
      icon: Clock,
      color: "bg-blue-500",
    },
    {
      label: "Completed Interviews",
      value: stats.completedInterviews,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Profile Strength",
      value: stats.profileStrength,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const scheduledInterviews = Array.isArray(upcomingInterviews) 
    ? upcomingInterviews.filter((interview) => interview.status === "scheduled")
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back!</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your interview performance and grow your career
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Users size={20} />
            <span>Join Interview Room</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-6 py-5 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Your Interview Pipeline
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {scheduledInterviews.length} interview{scheduledInterviews.length !== 1 ? "s" : ""} scheduled
                  </p>
                </div>
              </div>
              <button
                onClick={fetchUpcoming}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {scheduledInterviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No active interviews
                </h4>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  You're all caught up! No upcoming interviews in your schedule.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {scheduledInterviews.map((interview, index) => {
  console.log("Interview object:", interview);

  return (
    <InterviewCard
      key={index}
      {...interview}
      onJoin={(roomId) => {
        navigate(`/interview-room/${roomId}`);
      }}
    />
  );
})}             
        </div>
            )}
          </div>
        </div>

        {/* Join Room Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Join Interview Room
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="roomId"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  >
                    Room ID
                  </label>
                  <input
                    id="roomId"
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter 6-digit room ID"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinRoom}
                    disabled={!roomId.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardHome;