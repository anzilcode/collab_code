const InterviewDetails = () => {
  return (
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Interview Details</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Position:</span>
          <span>Software Engineer</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Duration:</span>
          <span className="text-green-400">45:30</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Language:</span>
          <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
