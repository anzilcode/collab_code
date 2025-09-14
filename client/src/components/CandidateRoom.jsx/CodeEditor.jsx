import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { sendCodeChange, subscribeToEditorLock,sendLanguageChange,sendRunCode,subscribeToCodeOutput  } from "../../sockets/CodeSocket";

const CodeEditor = ({
  code,
  setCode,
  output,
  setOutput,
  selectedLanguage,
  setSelectedLanguage,
  isDarkMode = true,
  roomId,
  panelWidth = 100,
  isCodeLocked,
  setIsCodeLocked      
}) => {

  const containerRef = useRef(null);
  const dragRef = useRef(null);

  const [editorHeight, setEditorHeight] = useState(null); // dynamic editor height
  const [isCodeLockedState, setIsCodeLockedState] = useState(false); // local lock state

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
  ];

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


  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case "javascript": return "javascript";
      case "python": return "python";
      case "c": return "c";
      case "cpp": return "cpp";
      case "java": return "java";
      default: return "javascript";
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (roomId) sendCodeChange(value, roomId);
  };

const runCode = () => {
  console.log("Run clicked:", { code, selectedLanguage, roomId });
  setOutput(`Running ${selectedLanguage} code...\n`);
  
  if (roomId) {
    sendRunCode(code, selectedLanguage, roomId);
  } else {
    console.warn("roomId is missing!");
  }
};


  // Resizable editor logic
  const startDragging = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startEditorHeight = editorHeight || containerRef.current.clientHeight * 0.65;

    const onMouseMove = (eMove) => {
      const newHeight = startEditorHeight + (eMove.clientY - startY);
      const minHeight = 100;
      const maxHeight = containerRef.current.clientHeight - 150;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
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

  useEffect(() => {
    setCode(getTemplateForLanguage(selectedLanguage));
}, [selectedLanguage]);


  // Subscribe to lock events from interviewer
  useEffect(() => {
    const unsubscribe = subscribeToEditorLock((locked) => {
      console.log("Candidate received lock:", locked);
      setIsCodeLockedState(locked);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
  if (!roomId) return;

  const unsubscribe = subscribeToCodeOutput((newOutput) => {
    console.log("Received output from server:", newOutput);
    setOutput(prev => prev + "\n" + newOutput);
  });

  return () => unsubscribe();
}, [roomId]);

  

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      style={{ minHeight: "500px", width: `${panelWidth}%` }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-3 text-sm text-gray-400">Main.code</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
              onChange={(e) => {
        const newLang = e.target.value;
         console.log("Candidate selected language:", newLang);
        setSelectedLanguage(newLang);
        setCode(getTemplateForLanguage(newLang));
        if (roomId) sendLanguageChange(newLang, roomId);
      }}
              className={`bg-gray-700 text-white text-sm rounded px-2 py-1 border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <button
            onClick={() => setOutput("Console cleared...")}
            className="p-1 text-gray-400 hover:text-red-400 text-sm"
          >
            Clear
          </button>
          <button
            onClick={runCode}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ height: editorHeight || "65%" }}>
        <Editor
          height="100%"
          width="100%"
          language={getMonacoLanguage(selectedLanguage)}
          theme={isDarkMode ? "vs-dark" : "light"}
          value={code}
          options={{
            readOnly: isCodeLocked,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", monospace',
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
          onChange={handleCodeChange}
        />
      </div>

      {/* Drag handle */}
      <div
        ref={dragRef}
        onMouseDown={startDragging}
        className="h-1 w-full hover:bg-gray-500 cursor-row-resize"
      />

      {/* Console Output */}
      <div className={`h-[calc(35%-1px)] border-t ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-medium text-green-400">Console Output</h3>
        </div>
        <pre className="h-full p-4 font-mono text-sm overflow-auto text-green-400">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;