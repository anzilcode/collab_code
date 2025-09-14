import { Code, Clock, Settings } from "lucide-react";


const Header = ({ timer, isDarkMode, setIsDarkMode }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between shadow-sm z-10`}>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">CodeCollab - Live Session</h1>
        </div>
        
        <div className="px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 bg-green-500 text-white shadow-lg">
          <span>🔴</span>
          <span>Live Interview</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-1"></div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Elapsed:</span>
            <span className="font-mono font-medium">{formatTime(timer.elapsed)}</span>
          </div>
          <div className="w-px h-4 bg-gray-400"></div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Remaining:</span>
            <span className={`font-mono font-medium ${timer.remaining < 300 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              {formatTime(timer.remaining)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header