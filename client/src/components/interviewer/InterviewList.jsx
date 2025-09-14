import { 
  Eye, Edit3, MessageSquare, Trash2, X, Star, Calendar, Clock, User, Filter, Send 
} from "lucide-react";
import { useState, useEffect } from "react";
import CandidateResumeModal from "../interviewer/CandidateDetails"; 
import InterviewFeedbackModal from "./FeedBackModel";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ✅ Helper to check if interview time has started
const hasInterviewStarted = (interview) => {
  const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
  const now = new Date();
  return now >= interviewDateTime; 
};

// ✅ Helper to parse duration strings into minutes
const parseDuration = (duration) => {
  if (!duration) return 0;

  let totalMinutes = 0;
  const hoursMatch = duration.match(/(\d+)\s*h/);
  const minsMatch = duration.match(/(\d+)\s*m/);
  const plainMinsMatch = duration.match(/^(\d+)$/);

  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  if (minsMatch) totalMinutes += parseInt(minsMatch[1], 10);
  if (plainMinsMatch) totalMinutes += parseInt(plainMinsMatch[1], 10);

  return totalMinutes;
};

const InterviewsList = ({
  interviews,
  onUpdateInterview,
  onDeleteInterview,
  onEditInterview,
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [viewCandidate, setViewCandidate] = useState(null);
  const [feedbackInterview, setFeedbackInterview] = useState(null);

  console.log(interviews);
  


  const filteredInterviews = interviews
    .filter((interview) => filterStatus === "all" || interview.status === filterStatus)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const handleAddFeedback = () => {
    if (feedbackInterview && feedbackText.trim()) {
      onUpdateInterview(feedbackInterview._id, {
        ...feedbackInterview,
        feedback: feedbackText,
        rating,
        status: "completed",
      });
      setFeedbackInterview(null);
      setFeedbackText("");
      setRating(5);
    }
  };

  const sendInvite = async (interviewId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/interviews/invite/${interviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Invitation sent successfully!");
      } else {
        alert("Failed to send invitation: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending the invitation.");
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = "px-3 py-1.5 text-xs font-semibold rounded-full border";
    switch (status) {
      case "scheduled":
        return `${baseStyle} bg-amber-900/30 text-amber-300 border-amber-700/50`;
      case "completed":
        return `${baseStyle} bg-emerald-900/30 text-emerald-300 border-emerald-700/50`;
      case "cancelled":
        return `${baseStyle} bg-red-900/30 text-red-300 border-red-700/50`;
      default:
        return `${baseStyle} bg-gray-700 text-gray-300 border-gray-600`;
    }
  };

  const getTypeBadgeStyle = () => {
    return "px-3 py-1.5 text-xs font-medium rounded-full bg-indigo-900/30 text-indigo-300 border border-indigo-700/50";
  };

  const handleEdit = (interview) => {
    if (onEditInterview) {
      onEditInterview(interview);
    }
  };

  // ✅ Auto-cancel scheduled interviews if duration passed
  useEffect(() => {
    const interval = setInterval(() => {
      interviews.forEach((interview) => {
        if (interview.status === "scheduled") {
          const start = new Date(`${interview.date}T${interview.time}`);
          const durationMinutes = parseDuration(interview.duration);
          const end = new Date(start.getTime() + durationMinutes * 60000);

          if (new Date() >= end) {
            onUpdateInterview(interview._id, {
              ...interview,
              status: "cancelled",
            });
          }
        }
      });
    }, 60 * 1000); // every 1 minute

    return () => clearInterval(interval);
  }, [interviews, onUpdateInterview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Interview Management
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Manage and track all your scheduled and completed interviews
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {filteredInterviews.length} interviews
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {filteredInterviews.filter(i => i.status === 'completed').length} completed
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 text-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 min-w-[180px]"
                >
                  <option value="all">All Interviews</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm">
                  {[{ label: "Candidate", icon: User },
                    { label: "Interview Type", icon: null },
                    { label: "Schedule", icon: Calendar },
                    { label: "Duration", icon: Clock },
                    { label: "Status", icon: null },
                    { label: "Actions", icon: null }].map((header) => (
                    <th key={header.label} className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-700/50">
                      <div className="flex items-center gap-2">
                        {header.icon && <header.icon className="h-4 w-4" />}
                        {header.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredInterviews.map((interview) => {
                  const candidate = interview.candidateId;

                  return (
                    <tr key={interview._id} className="group hover:bg-gray-700/30 transition-all duration-200">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {candidate?.profilePhoto ? (
                            <img
                              src={candidate.profilePhoto}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-600"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {candidate?.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-gray-100">
                              {candidate?.name || "No Name"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {interview._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={getTypeBadgeStyle()}>
                          {interview.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-100 flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {formatDate(interview.date)}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {formatTime(interview.time)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-300 font-medium">
                          {interview.duration}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={getStatusBadgeStyle(interview.status)}>
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <button
                            onClick={() => setViewCandidate(candidate)}
                            title="View Candidate Profile"
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit OR Feedback */}
                          {interview.status === "completed" ? (
                            <button
                              onClick={() => setFeedbackInterview(interview)}
                              title="Give Feedback"
                              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all duration-200"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(interview)}
                              title="Reschedule Interview"
                              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-all duration-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}

                          {/* Invite Mail */}
                          {interview.status === "scheduled" && (
                            <button
                              onClick={() => sendInvite(interview._id)}
                              title="Send Invite Mail"
                              className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all duration-200"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteInterview(interview._id)}
                            title="Delete Interview"
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              hasInterviewStarted(interview)
                                ? "text-gray-500 cursor-not-allowed bg-gray-700/50"
                                : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            }`}
                            disabled={hasInterviewStarted(interview)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Modal */}
        {feedbackInterview && (
          <InterviewFeedbackModal
            selectedInterview={feedbackInterview}
            setSelectedInterview={setFeedbackInterview}
            interviews={interviews}
          />
        )}

        {/* Candidate Resume Modal */}
        {viewCandidate && (
          <CandidateResumeModal
            candidate={viewCandidate}
            onClose={() => setViewCandidate(null)}
            onScheduleInterview={(candidate) => setViewCandidate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default InterviewsList;
