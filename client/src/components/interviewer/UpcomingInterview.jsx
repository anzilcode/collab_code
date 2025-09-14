import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Building2,
  FileText,
  Video,
  Mail,
  MoreVertical,
  AlertCircle,
  Eye,
  RefreshCcw,
  Send,
} from "lucide-react";
import CandidateResumeModal from './CandidateDetails'

const UpcomingInterviews = ({ interviews,onEditInterview }) => {
  const [now, setNow] = useState(new Date());

  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);


  const navigate = useNavigate();


  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate); 
    setShowCandidateModal(true);     
};

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30 * 1000); // update every 30s
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

  const handleSendInvite = async (interviewId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api/interviews/invite/${interviewId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to send invite");

    alert("Invitation sent successfully!");
  } catch (err) {
    console.error(err);
    alert("Error sending invitation");
  }
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

  const getInterviewStatus = (interview) => {
    const start = parseDateTime(interview.date, interview.time);
    const durationMins = parseInt(interview.duration) || 60;
    const end = new Date(start.getTime() + durationMins * 60000);
    const minutesUntilStart = Math.floor((start.getTime() - now.getTime()) / (1000 * 60));
    const minutesAfterStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));

    if (now >= start && now <= end) {
      return { 
        label: "Live Now", 
        color: "bg-red-500 animate-pulse", 
        canJoin: true,
        priority: 1,
        timeText: `${durationMins - minutesAfterStart}m remaining`
      };
    }

    if (minutesUntilStart <= 15 && minutesUntilStart > 0) {
      return { 
        label: "Starting Soon", 
        color: "bg-orange-500", 
        canJoin: true,
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

  const activeInterviews = interviews
    .filter((i) => i.status === "scheduled")
    .map((i) => ({
      ...i,
      scheduledAt: parseDateTime(i.date, i.time),
      interviewStatus: getInterviewStatus(i),
    }))
    .filter(i => !i.interviewStatus.expired)
    .sort((a, b) => {
      if (a.interviewStatus.priority !== b.interviewStatus.priority) {
        return a.interviewStatus.priority - b.interviewStatus.priority;
      }
      return a.scheduledAt - b.scheduledAt;
    });

  const getJoinButtonText = (status, interview) => {
    if (status.label === "Live Now") return "Join Interview";
    if (status.label === "Starting Soon") return "Get Ready";
    return `Join Available at ${interview.time}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-6 py-5 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                My Interview Schedule
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeInterviews.length} interview{activeInterviews.length !== 1 ? "s" : ""} scheduled
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeInterviews.length === 0 ? (
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
            {activeInterviews.map((interview) => {
              const status = interview.interviewStatus;
              const isUrgent = status.label === "Live Now" || status.label === "Starting Soon";

              return (
                <div
                  key={interview._id}
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
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${status.color} flex items-center space-x-1`}
                        >
                          {status.label === "Live Now" && <AlertCircle className="h-3 w-3" />}
                          <span>{status.label}</span>
                        </div>
                        {status.timeText && (
                          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                            isUrgent 
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                            {status.timeText}
                          </div>
                        )}
                      </div>

                      <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Interview with {interview.candidateId?.name || "Unknown Candidate"}
                      </h4>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Clock  className="h-4 w-4" />
                          <span className="font-medium">
                            {formatDateTime(interview.date, interview.time)} ({interview.duration})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Video className="h-4 w-4" />
                          <span className="capitalize">{interview.type} Interview</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {status.canJoin ? (
  <button
   onClick={() => navigate(`/interview-room/${interview.roomId}?candidateId=${interview.candidateId._id}`)}
    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
      status.label === "Live Now"
        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white animate-pulse"
        : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
    }`}
  >
    <Video className="h-4 w-4" />
    <span>{getJoinButtonText(status, interview)}</span>
  </button>
) : (
                        <div className="flex space-x-2">
                          <button 
                          title="View Profile"
                            onClick={() => handleViewCandidate(interview.candidateId)}
                              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                           <Eye className="h-5 w-5" />
                          </button>
                          <button 
                          onClick={() => onEditInterview(interview)}
                            title="Reschedule Interview"
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleSendInvite(interview._id)}
                            title="Send Invite via Email"
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Candidate Details
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {interview.candidateId?.name || "Name not provided"}
                        </p>
                        {interview.candidateId?.email && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {interview.candidateId.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Position
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {interview.candidateId?.jobRole || "Position TBD"}
                        </p>
                      </div>
                    </div>

                    {interview.notes && (
                      <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Interview Notes
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {interview.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showCandidateModal && selectedCandidate && (
  <CandidateResumeModal
    candidate={selectedCandidate}
    onClose={() => setShowCandidateModal(false)}
    onScheduleInterview={(candidate) => {
      console.log('Schedule interview for', candidate);
      setShowCandidateModal(false);
    }}
  />
)}

    </div>
  );
};

export default UpcomingInterviews;
