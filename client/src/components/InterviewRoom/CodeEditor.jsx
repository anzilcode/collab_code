import { useState, useRef ,useEffect} from "react";
import { 
   Lock, Unlock, Play, Terminal, Trash2, Maximize, Minimize, Sun, Moon, Code2
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { sendCodeChange,toggleEditorLock,sendLanguageChange,sendRunCode,subscribeToCodeOutput } from "../../sockets/CodeSocket";


const CodeEditor = ({ 
  code, 
  setCode, 
  output, 
  setOutput, 
  selectedLanguage, 
  setSelectedLanguage, 
  isCodeLocked, 
  setIsCodeLocked, 
  isDarkMode: parentDarkMode,
  panelWidth ,
  roomId,
  isExecuting,
  setIsExecuting
}) => {
  const languages = [
    { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
    { value: 'python', label: 'Python', color: '#3776AB' },
    { value: 'c', label: 'C', color: '#00599C' },
    { value: 'cpp', label: 'C++', color: '#00599C' },
    { value: 'java', label: 'Java', color: '#ED8B00' },
  ];


  const [isFullScreen, setIsFullScreen] = useState(false);
  const [localTheme, setLocalTheme] = useState(parentDarkMode ? 'dark' : 'light');
  const [editorHeight, setEditorHeight] = useState(null); // default: auto

  const containerRef = useRef(null);
  const dragRef = useRef(null);

  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      default: return 'javascript';
    }
  };

  const getTemplateForLanguage = (language) => {
  switch(language) {
    case "javascript":
      return `// Welcome to your coding interview!\n// You can start coding here...`;
    case "python":
      return `# Welcome to your coding interview!\n# You can start coding here...`;
    case "c":
      return `#include <stdio.h>\nint main() {\n    // You can start coding here...\n    return 0;\n}`;
    case "cpp":
      return `#include <iostream>\nusing namespace std;\nint main() {\n    // You can start coding here...\n    return 0;\n}`;
    case "java":
      return `public class Main {\n    public static void main(String[] args) {\n        // You can start coding here...\n    }\n}`;
    default:
      return "";
  }
};

const executeCode = () => {
  if (!roomId) return;

  setIsExecuting(true);
  const langObj = languages.find(l => l.value === selectedLanguage);
  setOutput(`🚀 Executing ${langObj?.label || selectedLanguage} code...\n${'━'.repeat(50)}\n`);

  sendRunCode(code, selectedLanguage, roomId);
};


  const currentLanguage = languages.find(l => l.value === selectedLanguage);

  // Drag logic
  const startDragging = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = editorHeight || (containerRef.current.clientHeight * 0.5); // Changed from 0.55 to 0.5

    const onMouseMove = (eMove) => {
      const newHeight = startHeight + (eMove.clientY - startY);
      const containerHeight = containerRef.current.clientHeight;
      const minEditorHeight = containerHeight * 0.25; // Min 25% for editor
      const maxEditorHeight = containerHeight * 0.75; // Max 75% for editor
      
      if (newHeight > minEditorHeight && newHeight < maxEditorHeight) {
        setEditorHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const consoleRef = useRef(null);

useEffect(() => {
  if (consoleRef.current) {
    consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }
}, [output]);

  useEffect(() => {
  setCode(getTemplateForLanguage(selectedLanguage));
}, [selectedLanguage]);


  return (
    <div 
      ref={containerRef}
      className={`flex flex-col transition-all duration-300 ${isFullScreen ? 'fixed top-0 left-0 w-screen h-screen z-50 shadow-2xl' : 'shadow-lg rounded-lg overflow-hidden'} ${localTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border ${localTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      style={{ width: isFullScreen ? '100%' : `${panelWidth}%`, minHeight: isFullScreen ? '100vh' : '500px' }}
    >
      {/* Header (kept exactly your code) */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${localTheme === 'dark' ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-750' : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'} backdrop-blur-sm`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <Code2 className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-semibold text-sm">Code Editor</h3>
            {isCodeLocked && (
              <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </div>
            )}
          </div>

          {/* Language Dropdown */}
          <div className="relative">
            <select 
              value={selectedLanguage}
             onChange={(e) => {
      const newLang = e.target.value;
      setSelectedLanguage(newLang);
      if (roomId) sendLanguageChange(newLang, roomId); 
    }}
              className={`appearance-none pl-8 pr-10 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${localTheme === 'dark' ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'} focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm`}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: currentLanguage?.color }} />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
                const newState = !isCodeLocked;
                setIsCodeLocked(newState);
                toggleEditorLock(roomId, newState);
              }}
          className={`p-2 rounded-lg transition-all duration-200 ${isCodeLocked ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105' : `${localTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} hover:shadow-md`}`} title={isCodeLocked ? 'Unlock Editor' : 'Lock Editor'}>
            {isCodeLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <button onClick={executeCode} disabled={isExecuting} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${isExecuting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'} text-white`}>
            <Play className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
          </button>
          <button onClick={() => setLocalTheme(localTheme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-lg transition-all duration-200 ${localTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} hover:shadow-md`}>
            {localTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsFullScreen(!isFullScreen)} className={`p-2 rounded-lg transition-all duration-200 ${localTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} hover:shadow-md`}>
            {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ height: editorHeight || '55%' }} className="relative flex-shrink-0"> {/* Changed from 70% to 55% */}
        {isCodeLocked && <div className="absolute top-2 right-4 z-10 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">🔒 Read Only</div>}
        <Editor
          height="100%"
          width="100%"
          language={getMonacoLanguage(selectedLanguage)}
          theme={localTheme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          options={{
            readOnly: isCodeLocked,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
            lineHeight: 1.6,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            bracketPairColorization: { enabled: true },
            guides: { indentation: true, bracketPairs: true }
          }}
          onChange={(value) => {
    setCode(value);          // update local state
    sendCodeChange(value, roomId); // send code to socket
}}
        />
      </div>

      {/* Drag Handle */}
      <div
        ref={dragRef}
        onMouseDown={startDragging}
        className={`h-2 w-full cursor-row-resize transition-all duration-200 flex items-center justify-center group ${localTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 border-y border-gray-600' : 'bg-gray-200 hover:bg-gray-300 border-y border-gray-300'}`}
        title="Drag to resize editor and console"
      >
        <div className={`w-12 h-0.5 rounded-full transition-all duration-200 ${localTheme === 'dark' ? 'bg-gray-500 group-hover:bg-gray-400' : 'bg-gray-400 group-hover:bg-gray-500'}`}></div>
      </div>

      {/* Console Output */}
      <div style={{ flex: 1, minHeight: '35%' }} className={`border-t ${localTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}> {/* Changed from 20% to 35% */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${localTheme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-green-500/10">
              <Terminal className="w-4 h-4 text-green-500" />
            </div>
            <h4 className="font-medium text-sm">Console Output</h4>
            {isExecuting && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-500">Executing...</span>
              </div>
            )}
          </div>
          <button onClick={() => setOutput('Console cleared...\n')} className={`p-2 rounded-lg transition-all duration-200 ${localTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-500 hover:text-red-500'} hover:shadow-md`} title="Clear Console">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <pre 
          ref={consoleRef} 
          className={`h-full p-4 font-mono text-sm overflow-auto leading-relaxed ${localTheme === 'dark' ? 'bg-gray-900/50 text-green-400' : 'bg-white/50 text-gray-700'} backdrop-blur-sm scroll-smooth`}
          style={{ scrollBehavior: 'smooth' }}
        >
          {output || "Ready to execute code...\nPress 'Run Code' to see output here."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;