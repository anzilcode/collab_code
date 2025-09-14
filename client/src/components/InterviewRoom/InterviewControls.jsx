import { Share2 } from "lucide-react";
const InterviewControls = ({ isDarkMode }) => {
  return (
    <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} space-y-3`}>
      <div className="flex space-x-2">
        <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl">
          ⏸️ Pause Interview
        </button>
        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl">
          🏁 End Interview
        </button>
      </div>
      
      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
        <Share2 className="w-4 h-4" />
        <span>Generate Interview Report</span>
      </button>
      
      <div className="text-xs text-gray-400 text-center pt-2">
        Session ID: #INT-2024-{Math.random().toString(36).substr(2, 6).toUpperCase()}
      </div>
    </div>
  );
};

export default InterviewControls