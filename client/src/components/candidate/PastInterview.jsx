import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Clock, CheckCircle, X, Award, Filter, Search, 
  Calendar, TrendingUp, Briefcase, Building, MapPin, Star, Eye
} from "lucide-react";

// Feedback Modal Component
function FeedbackModal({ isOpen, onClose, feedback, interviewer }) {
  if (!isOpen) return null;

  const getDecisionColor = (decision) => {
    return decision === "selected" ? "text-green-400" : "text-red-400";
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={i < rating ? "text-yellow-400 fill-current" : "text-gray-500"}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Interview Feedback</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {feedback ? (
            <>
              {/* Interviewer */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Interviewer</label>
                <p className="text-white">{interviewer?.name || "N/A"}</p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">{renderStars(feedback.rating || 0)}</div>
                  <span className="text-gray-400 text-sm">({feedback.rating || 0}/5)</span>
                </div>
              </div>

              {/* Decision */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Decision</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                  feedback.decision === "selected" 
                    ? "bg-green-900 text-green-300" 
                    : "bg-red-900 text-red-300"
                }`}>
                  {feedback.decision === "selected" ? (
                    <CheckCircle size={14} className="mr-1" />
                  ) : (
                    <X size={14} className="mr-1" />
                  )}
                  {feedback.decision || "N/A"}
                </span>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Feedback</label>
                <div className="bg-gray-800 rounded-md p-4 max-h-32 overflow-y-auto">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feedback.feedbackText || "No feedback available."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center py-4">No feedback available for this interview.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Interview Card Component
function PastInterviewCard({ role, date, status, company, location, feedback, interviewer, duration }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizedStatus = status?.toLowerCase();

  const statusConfig = {
    completed: { 
      bg: "bg-green-900", 
      text: "text-green-300", 
      icon: CheckCircle 
    },
    cancelled: { 
      bg: "bg-yellow-900", 
      text: "text-yellow-300", 
      icon: X 
    }
  };

  const config = statusConfig[normalizedStatus];
  const StatusIcon = config?.icon;
  const shouldShowBadge = normalizedStatus === "completed" || normalizedStatus === "cancelled";
  const shouldShowFeedbackButton = normalizedStatus === "completed";

  return (
    <>
      <div className="bg-gray-900 border border-gray-700 hover:border-gray-600 p-6 rounded-lg transition-colors relative">
        {/* Status Badge */}
        {shouldShowBadge && (
          <div className={`absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 rounded-md ${config.bg} ${config.text}`}>
            <StatusIcon size={14} />
            <span className="text-xs font-medium capitalize">{normalizedStatus}</span>
          </div>
        )}

        <div className="pr-24">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-900 p-3 rounded-lg">
              <Briefcase className="text-blue-400" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2">{role}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-400 text-sm">
                  <Building size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{company}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span>{date} • {duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Button */}
        {shouldShowFeedbackButton && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white text-sm"
            >
              <Eye size={16} />
              <span>View Feedback</span>
            </button>
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feedback={feedback}
        interviewer={interviewer}
      />
    </>
  );
}

// Stats Component
function InterviewStats({ interviews }) {
  const normalizedInterviews = interviews.filter(i => {
    const status = i.status?.toLowerCase();
    return status === "completed" || status === "cancelled";
  });

  const completed = normalizedInterviews.filter(i => i.status?.toLowerCase() === "completed").length;
  const selected = normalizedInterviews.filter(i => i.feedback?.decision === "selected").length;
  const cancelled = normalizedInterviews.filter(i => i.status?.toLowerCase() === "cancelled").length;
  const total = normalizedInterviews.length;
  const successRate = total > 0 ? Math.round((selected / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {[ 
        { label: "Total Interviews", value: total, icon: <Briefcase className="text-blue-400" size={20}/>, color: "blue" },
        { label: "Selected", value: selected, icon: <Award className="text-green-400" size={20}/>, color: "green" },
        { label: "Completed", value: completed, icon: <CheckCircle className="text-green-400" size={20}/>, color: "green" },
        { label: "Cancelled", value: cancelled, icon: <X className="text-yellow-400" size={20}/>, color: "yellow" },
        { label: "Success Rate", value: `${successRate}%`, icon: <TrendingUp className="text-purple-400" size={20}/>, color: "purple" }
      ].map((stat, idx) => (
        <div key={idx} className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
            </div>
            <div className={`bg-${stat.color}-900 p-2 rounded-lg`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// PastInterviews Page
function PastInterviews() {
  const user = JSON.parse(localStorage.getItem("user"));
  const candidateId = user?._id;

  const [pastInterviews, setPastInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchPastInterviews = async () => {
      if (!candidateId) return;
      try {
        const res = await axios.get(`http://localhost:4000/api/interview/past/${candidateId}`);
        setPastInterviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setPastInterviews([]);
      }
    };
    fetchPastInterviews();
  }, [candidateId]);

  const filteredInterviews = pastInterviews.filter(i => {
    const status = i.status?.toLowerCase();
    const matchesStatus = status === "completed" || status === "cancelled";
    const matchesSearch = 
      i.role?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || status === statusFilter.toLowerCase();
    return matchesStatus && matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <Clock className="text-gray-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Past Interviews</h1>
            <p className="text-gray-400">Review your interview history and feedback</p>
          </div>
        </div>

        {/* Stats */}
        <InterviewStats interviews={filteredInterviews} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none min-w-[160px]"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Interview List */}
        <div className="space-y-4">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview, idx) => (
              <PastInterviewCard key={idx} {...interview} />
            ))
          ) : (
            <div className="bg-gray-900 border border-gray-700 p-12 rounded-lg text-center">
              <div className="bg-gray-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No interviews found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PastInterviews;