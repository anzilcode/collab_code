import { Code, PenTool, Play, Copy, Download, Maximize2, Settings } from 'lucide-react';

const TopNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'code' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4 inline mr-2" />
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'whiteboard' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4 inline mr-2" />
            Whiteboard
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {activeTab === 'code' && (
          <>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run Code
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Copy className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </>
        )}
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopNavigation;
