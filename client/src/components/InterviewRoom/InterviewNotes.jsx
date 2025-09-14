import { FileText } from "lucide-react";
const InterviewNotes = ({ isDarkMode }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="font-semibold flex items-center">
          <FileText className="w-4 h-4 mr-2 text-green-400" />
          Interview Notes
        </h3>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          placeholder="Add your interview notes here...
• Technical skills assessment
• Problem-solving approach
• Communication clarity
• Code quality and structure
• Areas for improvement
• Overall impression"
          className={`w-full h-full p-3 rounded-lg border text-sm resize-none ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>
    </div>
  );
};

export default InterviewNotes