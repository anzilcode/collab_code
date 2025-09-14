import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FileText, Settings } from 'lucide-react';
import Sidebar from '../components/interviewer/Sidebar';
import Dashboard from '../components/interviewer/Dashboard';
import CandidatesList from '../components/interviewer/CandidateList';
import ScheduleInterview from '../components/interviewer/Schedule';
import InterviewsList from '../components/interviewer/InterviewList';
import Questions from '../components/interviewer/Questions';
import CandidateDetail from '../components/interviewer/CandidateDetails';
import AccountSettings from '../components/interviewer/Settings';

const InterviewerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);


  // Fetch candidates
  const fetchCandidates = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:4000/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const normalized = data.map(c => ({
        ...c,
        skills: Array.isArray(c.skills) ? c.skills : c.skills?.split(',') || [],
        avatar: c.profilePhoto || 'https://via.placeholder.com/150',
        experience: c.experience || 'N/A',
        education: c.education || 'N/A',
        position: c.jobRole || 'N/A'
      }));

      setCandidates(normalized);
    } catch (err) {
      console.error(err);
    }
  }, []);



const fetchInterviews = useCallback(async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      "http://localhost:4000/api/interviews/my", 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setInterviews(data);
  } catch (err) {
    console.error("Error fetching interviews:", err);
  }
}, []);



  useEffect(() => {
    fetchCandidates();
    fetchInterviews();
  }, [fetchCandidates, fetchInterviews]);

const handleScheduleInterview = async (newInterview) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); 
    const interviewerId = user._id;
    const { data } = await axios.post(
      "http://localhost:4000/api/interviews/schedule",
      { ...newInterview, interviewerId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setInterviews(prev => [...prev, data.interview]);

    setActiveTab("interviews");

    await fetchInterviews()
    console.log("New interview scheduled:", data.interview);
  } catch (err) {
    console.error("Error scheduling interview:", err);
  }
};



const handleUpdateInterview = async (interviewId, updatedInterview) => {
  try {
    const token = localStorage.getItem("token");

    // Create a payload that excludes 'interviewer' and only includes updatable fields
    const payload = {
      date: updatedInterview.date,
      time: updatedInterview.time,
      type: updatedInterview.type,
      duration: updatedInterview.duration,
      companyName: updatedInterview.companyName,
      location: updatedInterview.location,
      notes: updatedInterview.notes,
      status: updatedInterview.status,
      roomId: updatedInterview.roomId
    };

    const { data } = await axios.put(
      `http://localhost:4000/api/interviews/update/${interviewId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update frontend state
    setInterviews((prev) =>
      prev.map((interview) =>
        interview._id === interviewId ? data.interview : interview
      )
    );

    setEditingInterview(null);
    setSelectedCandidate(null);
    setActiveTab("interviews");

  } catch (err) {
    if (err.response && err.response.status === 403) {
      alert("You are not allowed to update this interview.");
    } else {
      console.error("Error updating interview:", err);
    }
  }
};


const handleDeleteInterview = async (interviewId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:4000/api/interviews/delete/${interviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setInterviews((prev) => prev.filter((i) => i._id !== interviewId));
  } catch (err) {
    if (err.response && err.response.status === 403) {
      alert("You are not allowed to delete this interview.");
    } else {
      console.error("Error deleting interview:", err);
    }
  }
};

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetail(true);
  };

  const handleScheduleFromCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetail(false);
    setActiveTab('schedule');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard interviews={interviews} candidates={candidates} darkMode 
          onEditInterview={(interview) => {
      setEditingInterview(interview); 
      setSelectedCandidate(interview.candidateId);
      setActiveTab("schedule"); 
    }}
        />;
      case 'candidates':
        return <CandidatesList candidates={candidates} onSelectCandidate={handleSelectCandidate} darkMode />;
      case 'schedule':
       return <ScheduleInterview
  selectedCandidate={selectedCandidate}
  editingInterview={editingInterview}        
  onSchedule={handleScheduleInterview}          
  onUpdate={handleUpdateInterview}   
  candidates={candidates}
  darkMode
/>;

      case 'interviews':
        return <InterviewsList
          interviews={interviews}
          candidates={candidates}
          onUpdateInterview={handleUpdateInterview}
          onDeleteInterview={handleDeleteInterview}
          onEditInterview={(interview) => {
          setEditingInterview(interview); 
          setSelectedCandidate(interview.candidateId);
          setActiveTab("schedule"); 
  }}
          darkMode
        />;
      case 'questions':
        return <Questions />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <Dashboard interviews={interviews} candidates={candidates} darkMode />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="h-screen overflow-y-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 h-screen overflow-y-auto">{renderContent()}</div>

      {showCandidateDetail && selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onClose={() => setShowCandidateDetail(false)}
          onScheduleInterview={handleScheduleFromCandidate}
          darkMode
        />
      )}
    </div>
  );
};

export default InterviewerDashboard;
