import { MoreVertical, FileText, Award, MapPin, Briefcase, Clock, User } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import CandidateResumeModal from "../../components/interviewer/CandidateDetails";
import InterviewFeedbackModal from "../../components/interviewer/FeedBackModel";
import { useParams, useSearchParams } from 'react-router-dom';

const CandidateProfile = ({ candidateId, isDarkMode }) => {
  const [candidateInfo, setCandidateInfo] = useState({
    user: {},
    avatar: "C",
    name: "",
    email: "",
    position: "",
    experience: "",
    location: "",
    skills: [],
    profilePhoto: "",
  });
  const [loading, setLoading] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const { id: roomId } = useParams();
  const [searchParams] = useSearchParams();
  const candidateIdFromURL = searchParams.get('candidateId');

  const effectiveCandidateId = candidateId || candidateIdFromURL;

  useEffect(() => {
    if (!effectiveCandidateId) return;

    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); 
        const res = await axios.get(
          `http://localhost:4000/api/resume/${effectiveCandidateId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        console.log("Backend response:", data);

        setCandidateInfo({
          user: data.user || {},
          avatar: data.user?.name?.[0] || "C",
          name: data.user?.name || "",
          email: data.user?.email || "",
          position: data.jobRole || "",
          experience: data.experience || "",
          location: data.location || "",
          skills: data.skills ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
          profilePhoto: data.profilePhoto || "",
          phone: data.phone || "",
          profileSummary: data.profileSummary || "",
          education: data.education || "",
          certifications: data.certifications ? data.certifications.split(",").map(c => c.trim()) : [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching candidate details:", err);
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [effectiveCandidateId]);

  if (loading) {
    return (
      <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className="flex-1">
              <div className={`h-4 rounded w-3/4 mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className={`h-3 rounded w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 border-b transition-all duration-200 ${isDarkMode ? 'border-gray-700 bg-gradient-to-br from-gray-800 to-gray-750' : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'}`}>
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-blue-500/20 shadow-lg">
            {candidateInfo.profilePhoto ? (
              <img src={candidateInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-semibold text-white shadow-inner">
                {candidateInfo.avatar}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg truncate mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words">
            {candidateInfo.name}
          </h2>
          <p className={`text-sm flex items-center space-x-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} break-words`}>
            <User className="w-3 h-3" />
            <span>{candidateInfo.email}</span>
          </p>
        </div>
        <button className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} shadow-sm hover:shadow-md`}>
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      {/* Details */}
      <div className="space-y-3 text-sm">
        {[
          { label: "Position", value: candidateInfo.position, icon: <Briefcase className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} /> },
          { label: "Experience", value: candidateInfo.experience, icon: <Clock className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} /> },
          { label: "Location", value: candidateInfo.location, icon: <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} /> },
        ].map((item, idx) => (
          <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
            <div className="flex items-center space-x-2 mb-1 sm:mb-0">
              {item.icon}
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{item.label}:</span>
            </div>
            <span className="font-semibold break-words max-w-full">{item.value || "-"}</span>
          </div>
        ))}
      </div>
      
      {/* Skills */}
      <div className="mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Key Skills:</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {candidateInfo.skills.slice(0, 10).map((skill, index) => (
            <span 
              key={skill} 
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                index % 3 === 0 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : index % 3 === 1 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              } break-words`}
            >
              {skill}
            </span>
          ))}
          {candidateInfo.skills.length > 10 && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-gray-600/20 text-gray-300 border-gray-600/30' : 'bg-gray-500/20 text-gray-600 border-gray-500/30'}`}>
              +{candidateInfo.skills.length - 10} more
            </span>
          )}
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex space-x-2 mt-4">
        <button 
          onClick={() => setShowResumeModal(true)} 
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FileText className="w-3 h-3" />
          <span>Resume</span>
        </button>
        <button 
          onClick={() => setShowFeedbackModal(true)}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Award className="w-3 h-3" />
          <span>Feedback</span>
        </button>
      </div>

      {/* Modals */}
      {showResumeModal && (
        <CandidateResumeModal
          candidate={candidateInfo}
          onClose={() => setShowResumeModal(false)}
          onScheduleInterview={(cand) => console.log("Schedule interview for", cand)}
        />
      )}

      {showFeedbackModal && candidateInfo.user?._id && (
        <InterviewFeedbackModal
          selectedInterview={{
            _id: roomId,            
            candidateId: candidateInfo.user._id,  
            interviewerId: localStorage.getItem("userId"), 
          }}
          setSelectedInterview={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
};

export default CandidateProfile;
