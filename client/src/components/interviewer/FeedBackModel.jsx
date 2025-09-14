import { useState, useEffect } from 'react';
import { X, Star, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const InterviewFeedbackModal = ({ selectedInterview, setSelectedInterview }) => {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [decision, setDecision] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  console.log("Selected Interview:", selectedInterview);


  // Load existing feedback if available
  useEffect(() => {
    if (selectedInterview?._id) {
      const fetchFeedback = async () => {
        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.get(
            `http://localhost:4000/api/feedback/interview/${selectedInterview._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.feedback) {
            setRating(data.feedback.rating);
            setFeedbackText(data.feedback.feedbackText);
            setDecision(data.feedback.decision);
            setIsUpdate(true);
          }
        } catch (err) {
          console.error("Error fetching feedback:", err);
        }
      };

      fetchFeedback();
    }
  }, [selectedInterview]);

const handleAddFeedback = async () => {
  if (!decision) {
    console.error("Please select a decision before submitting feedback.");
    return;
  }

  if (!selectedInterview?.candidateId?.user) {
    console.error(
      "Candidate User ID is missing in the selected interview:",
      selectedInterview
    );
    return;
  }

  const payload = {
    candidateId: selectedInterview.candidateId.user, 
    rating,
    decision,
    feedbackText,
  };

  console.log("Submitting feedback payload:", payload);

  try {
    console.log("Submitting feedback for interview ID:", selectedInterview._id);
    const response = await axios.post(
      `http://localhost:4000/api/feedback/interview/${selectedInterview._id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Feedback submitted successfully:", response.data);
    setSelectedInterview(null);
  } catch (error) {
    console.error(
      "Error submitting feedback:",
      error.response?.data?.message || error.message
    );
  }
};

  

  if (!selectedInterview) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl max-w-2xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-100">Interview Feedback</h3>
              <p className="text-gray-400 mt-1 text-sm">
                Share your thoughts about the candidate's performance
              </p>
            </div>
            <button
              onClick={() => setSelectedInterview(null)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Decision Section */}
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Interview Decision *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDecision('selected')}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                    decision === 'selected'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-gray-600/50 bg-gray-700/30 text-gray-300 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle2 className={`h-5 w-5 ${decision === 'selected' ? 'text-emerald-400' : 'text-gray-400'}`} />
                    <span className="font-semibold text-sm">Selected</span>
                  </div>
                  {decision === 'selected' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setDecision('rejected')}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                    decision === 'rejected'
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-gray-600/50 bg-gray-700/30 text-gray-300 hover:border-red-500/50 hover:bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <XCircle className={`h-5 w-5 ${decision === 'rejected' ? 'text-red-400' : 'text-gray-400'}`} />
                    <span className="font-semibold text-sm">Rejected</span>
                  </div>
                  {decision === 'rejected' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* Decision helper text */}
              <div className="mt-2 text-xs text-gray-500">
                {decision === 'selected' && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Candidate will proceed to the next stage</span>
                  </div>
                )}
                {decision === 'rejected' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="h-3 w-3" />
                    <span>Candidate will not proceed further</span>
                  </div>
                )}
                {!decision && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Please select an interview decision</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 transition-all duration-200 rounded ${
                      star <= rating ? "text-amber-400 hover:text-amber-300" : "text-gray-600 hover:text-gray-500"
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-400">
                  {rating > 0 ? `${rating} out of 5 stars` : 'No rating selected'}
                </span>
              </div>
            </div>

            {/* Feedback Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Detailed Feedback
                <span className="text-gray-500 font-normal ml-1">(Optional)</span>
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-100 transition-all duration-200 resize-none placeholder:text-gray-500"
                placeholder="Provide comprehensive feedback including strengths, areas for improvement, technical skills assessment..."
              />
              <div className="mt-1 text-xs text-gray-500">
                {feedbackText.length}/2000 characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddFeedback}
                disabled={!decision}
                className={`flex-1 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg text-sm ${
                  !decision 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : decision === 'selected'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                }`}
              >
                {!decision 
                  ? 'Select Decision First' 
                  : isUpdate 
                    ? 'Update Feedback' 
                    : decision === 'selected' 
                      ? 'Confirm Selection' 
                      : 'Confirm Rejection'
                }
              </button>
              <button
                onClick={() => setSelectedInterview(null)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 px-6 py-2.5 rounded-xl font-semibold border border-gray-600/50 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;
