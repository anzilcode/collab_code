import { Code } from 'lucide-react';

const Header = () => {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">CodeCollab</h1>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Live Interview
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header