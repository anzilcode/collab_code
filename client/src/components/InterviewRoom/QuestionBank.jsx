import { BookOpen } from "lucide-react";

const QuestionBank = ({ questions, onInsertQuestion, isDarkMode }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 text-green-100';
      case 'Medium': return 'bg-yellow-500 text-yellow-100';
      case 'Hard': return 'bg-red-500 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold mb-4 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Question Bank
        </h3>
        <div className="space-y-3">
          {questions.map(question => (
            <div
              key={question._id}
              onClick={() => onInsertQuestion(question)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{question.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>📂 {question.category}</div>
                <div>⏱️ {question.timeEstimate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank