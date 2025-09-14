import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { X, Search, Copy, Plus, Mail, Send } from "lucide-react";

const CreateRoom = ({ resumes = [], onClose }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [interviewFor, setInterviewFor] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [roomId, setRoomId] = useState('');
  const [copied, setCopied] = useState(false);


  const navigate = useNavigate();


  console.log(resumes)

  // Filter resumes locally (no backend)
  const filteredCandidates = (resumes || []).filter(candidate =>
    candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate?.jobRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateInterviewLink = () => {
    const uuid = crypto.randomUUID();
    setGeneratedLink(`https://interview.example.com/room/${uuid}`);
    setRoomId(uuid.substring(0, 8).toUpperCase());
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  const resetForm = () => {
    setSelectedCandidate(null);
    setSearchTerm('');
    setInterviewFor('');
    setCompanyName('');
    setLocation('');
    setGeneratedLink('');
    setRoomId('');
    setCopied(false);
  };

  // Inside your CreateRoom component
const handleCreateRoom = async () => {
  if (!selectedCandidate) {
    alert("Please select a candidate to create the room.");
    return;
  }

  const storedUser = localStorage.getItem("user");
  let interviewerId = null;

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      interviewerId = parsedUser._id;
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }

  if (!interviewerId) {
    alert("No interviewer found. Please log in again.");
    return;
  }

  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const year = currentDate.getFullYear();
  const date = `${month}/${day}/${year}`;
  const time = currentDate.toTimeString().split(" ")[0];

  const payload = {
    candidateId: selectedCandidate._id,
    interviewerId,
    date,
    time,
    type: "Technical",
    companyName,
    location,
    roomId,
    notes: "",
  };

  try {
    const response = await fetch("http://localhost:4000/api/interviews/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      navigate(`/interview-room/${roomId}?candidateId=${selectedCandidate?._id || ""}`);
    } else {
      alert(`Failed to create room: ${data.error}`);
    }
  } catch (err) {
    console.error("Create room error:", err);
    alert("Something went wrong while creating the room.");
  }
};



  const handleClose = () => {
    resetForm();
    if (onClose) onClose();
  };

  const isGenerateDisabled = !interviewFor.trim() || !companyName.trim() || !location.trim();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-100">Create Interview Room</h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Candidate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Candidate (Optional)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {searchTerm && (
                <div className="mt-2 max-h-40 overflow-y-auto bg-gray-700 rounded-lg border border-gray-600">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map(candidate => (
                      <button
                        key={candidate._id}
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setSearchTerm('');
                        }}
                        className="w-full text-left p-3 hover:bg-gray-600 transition-colors"
                      >
                        <p className="text-gray-100 font-medium">{candidate.name}</p>
                        <p className="text-gray-400 text-sm">{candidate.jobRole}</p>
                        {candidate.email && (
                          <p className="text-gray-500 text-xs">{candidate.email}</p>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-gray-400 text-sm">No candidates found</p>
                  )}
                </div>
              )}

              {selectedCandidate && (
                <div className="mt-2 p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 font-medium">{selectedCandidate.name}</p>
                    <p className="text-gray-400 text-sm">{selectedCandidate.jobRole}</p>
                    {selectedCandidate.email && (
                      <p className="text-gray-500 text-xs">{selectedCandidate.email}</p>
                    )}
                  </div>
                  <button onClick={() => setSelectedCandidate(null)} className="text-gray-400 hover:text-gray-200">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mandatory Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Interview Purpose <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Technical Round, HR Discussion"
                value={interviewFor}
                onChange={(e) => setInterviewFor(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Remote / City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Generate Link */}
            <button
              onClick={generateInterviewLink}
              disabled={isGenerateDisabled}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
            >
              Generate Interview Link
            </button>

            {/* Generated Link & Room ID */}
            {generatedLink && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 text-center">
                  <p className="text-sm text-gray-400 mb-2">Room ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-bold text-blue-400 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
                      {roomId}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                        copied ? 'bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                      }`}
                      title={copied ? 'Copied!' : 'Copy link'}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share this Room ID or the full link below
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Interview Room Link
                  </label>
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm"
                  />
                </div>

                {/* Invite via Email Button */}

                {/* Create Room Button */}
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create Room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;