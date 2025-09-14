import { useState, useContext, useMemo, useEffect } from "react";
import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { ResumeContext } from "../../Context/ResumeContext";
import { v4 as uuidv4 } from "uuid";
import { showSuccessToast, showErrorToast, TOAST_MESSAGES } from '../../components/Utils/Toast'

const ScheduleInterview = ({ onSchedule, onUpdate, editingInterview, selectedCandidate }) => {
  const { resumes } = useContext(ResumeContext);
  const safeResumes = Array.isArray(resumes) ? resumes : resumes ? [resumes] : [];

  const [candidateSearch, setCandidateSearch] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Technical");
  const [duration, setDuration] = useState("60");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const interviewTypes = [
    "Technical",
    "Behavioral",
    "Cultural Fit",
    "Final Round",
    "Phone Screen",
  ];

  const filteredCandidates = useMemo(() => {
    return safeResumes.filter(
      (r) =>
        r.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        r.jobRole.toLowerCase().includes(candidateSearch.toLowerCase())
    );
  }, [candidateSearch, safeResumes]);

  const validateForm = () => {
    if (!selectedCandidateId || !date || !time || !companyName || !location) {
      setError("Please fill in all required fields");
      return false;
    }
    const selectedDateTime = new Date(`${date}T${time}`);
    if (selectedDateTime <= new Date()) {
      setError("Cannot schedule interviews in the past");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!selectedResume) {
      setError("Selected candidate not found");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const interviewer = user?.name || "Unknown Interviewer";
    const roomId = editingInterview?.roomId || uuidv4();

    const interviewData = {
      candidateId: selectedCandidateId,
      date,
      time,
      type,
      duration: `${duration} min`,
      companyName,
      location,
      status: "scheduled",
      interviewer,
      notes,
      roomId,
    };

    try {
      if (editingInterview) {

        if (onUpdate) onUpdate(editingInterview._id, interviewData);
        showSuccessToast(`rescheduled successfully!`);
      } else {

        if (onSchedule) onSchedule(interviewData);
        showSuccessToast(`scheduled successfully!`);
      }

      // Reset form
      setCandidateSearch("");
      setSelectedCandidateId("");
      setSelectedResume(null);
      setDate("");
      setTime("");
      setType("Technical");
      setDuration("60");
      setCompanyName("");
      setLocation("");
      setNotes("");
      setError("");
    } catch (err) {
      console.error(err);
      setError(editingInterview ? "Failed to update interview" : "Failed to schedule interview");
    }
  };

  useEffect(() => {
    if (editingInterview) {
      setCandidateSearch(editingInterview.candidateId?.name || "");
      setSelectedCandidateId(editingInterview.candidateId?._id || "");
      setSelectedResume(editingInterview.candidateId || null);
      setDate(editingInterview.date || "");
      setTime(editingInterview.time || "");
      setType(editingInterview.type || "Technical");
      setDuration(editingInterview.duration?.replace(" min", "") || "60");
      setCompanyName(editingInterview.companyName || "");
      setLocation(editingInterview.location || "");
      setNotes(editingInterview.notes || "");
    }
  }, [editingInterview]);

  return (
    <div className="space-y-6 text-gray-100">
      <div>
        <h2 className="text-2xl font-bold text-white">Schedule Interview</h2>
        <p className="text-gray-300">Set up a new interview with a candidate</p>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 space-y-6">
        {/* Candidate Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Candidate *</label>
          <input
            type="text"
            value={candidateSearch}
            onChange={(e) => {
              setCandidateSearch(e.target.value);
              setSelectedCandidateId("");
              setSelectedResume(null);
            }}
            placeholder="Search candidate by name or job role..."
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {candidateSearch && filteredCandidates.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto">
              {filteredCandidates.map((c) => (
                <li
                  key={c._id}
                  className="px-3 py-2 hover:bg-gray-600 cursor-pointer text-gray-100 flex justify-between items-center"
                  onClick={() => {
                    setCandidateSearch(c.name);
                    setSelectedCandidateId(c._id);
                    setSelectedResume(c);
                  }}
                >
                  <span>{c.name} - {c.jobRole}</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </li>
              ))}
            </ul>
          )}
          {candidateSearch && filteredCandidates.length === 0 && (
            <p className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-lg mt-1 px-3 py-2 text-gray-400">
              No candidates found
            </p>
          )}
        </div>

        {/* Selected Candidate Avatar */}
        {selectedResume && selectedResume.profilePhoto && (
          <div className="flex items-center gap-4 mt-2">
            <img
              src={selectedResume.profilePhoto}
              alt={selectedResume.name}
              className="h-12 w-12 rounded-full object-cover border border-gray-600"
            />
            <div>
              <p className="text-gray-100 font-medium">{selectedResume.name}</p>
              <p className="text-gray-400 text-sm">{selectedResume.jobRole}</p>
            </div>
          </div>
        )}

        {/* Company & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Interview Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {interviewTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Date / Time / Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time *</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any specific notes..."
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-700 border border-red-600 rounded-lg text-red-100">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" /> {editingInterview ? "Update Interview" : "Schedule Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;

