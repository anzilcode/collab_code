import { 
  X, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, 
  Calendar, Download, User, FileText, Clock
} from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

const CandidateResumeModal = ({ candidate, onClose, onScheduleInterview }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!candidate) return null;
  console.log("Candidate",candidate);
  

  const skills = Array.isArray(candidate.skills)
    ? candidate.skills
    : candidate.skills
    ? candidate.skills.split(',').map(s => s.trim()).filter(s => s)
    : [];

  const certifications = Array.isArray(candidate.certifications)
    ? candidate.certifications
    : candidate.certifications
    ? candidate.certifications.split(',').map(c => c.trim()).filter(c => c)
    : [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'details', label: 'Professional Details', icon: Briefcase },
    { id: 'skills', label: 'Skills & Certifications', icon: Award }
  ];

  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Candidate Name: ${candidate.name}`, 10, 20);
  doc.text(`Email: ${candidate.email}`, 10, 30);
  doc.text(`Phone: ${candidate.phone}`, 10, 40);
  doc.text(`Location: ${candidate.location}`, 10, 50);
  doc.text(`Job Role: ${candidate.jobRole}`, 10, 60);
  doc.text(`Experience: ${candidate.experience}`, 10, 70);
  doc.text(`Education: ${candidate.education}`, 10, 80);
  doc.save(`${candidate.name}_Resume.pdf`);
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img
                src={candidate.profilePhoto || candidate.avatar || 'https://via.placeholder.com/80'}
                alt={candidate.name}
                className="w-16 h-16 rounded-full border-2 border-gray-700 object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-gray-300 font-medium">{candidate.jobRole || candidate.position}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {candidate.location || 'Location not specified'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {candidate.experience || 'Experience not specified'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-300 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-gray-200">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span className="break-all">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>{candidate.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>{candidate.location || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <span>{candidate.jobRole || candidate.position}</span>
                  </div>
                </div>
              </div>

              {/* Profile Summary */}
              {candidate.profileSummary && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Profile Summary</h3>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <p className="leading-relaxed">{candidate.profileSummary}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                  Education
                </h3>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  {candidate.education ? (
                    <p>{candidate.education}</p>
                  ) : (
                    <p className="italic text-gray-400">No education information provided</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  Experience
                </h3>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  {candidate.experience ? (
                    <p>{candidate.experience}</p>
                  ) : (
                    <p className="italic text-gray-400">No experience information provided</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-gray-700 text-blue-400 rounded-lg text-sm font-medium border border-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No skills specified</p>
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Certifications
                </h3>
                {certifications.length > 0 ? (
                  <div className="space-y-2">
                    {certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg"
                      >
                        <Award className="h-5 w-5 text-purple-400 flex-shrink-0" />
                        <span className="text-purple-300 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <Award className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No certifications listed</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-700 px-6 py-4 bg-gray-800 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Application ID: {candidate._id?.toString().slice(-8) || 'N/A'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 font-medium transition-colors"
            >
              Close
            </button>
            <button onClick={handleDownloadPDF} className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={() => onScheduleInterview(candidate)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateResumeModal;
