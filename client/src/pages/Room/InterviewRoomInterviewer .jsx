import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../components/InterviewRoom/Header";
import CandidateProfile from "../../components/InterviewRoom/CandidateProfile";
import CodeEditor from "../../components/InterviewRoom/CodeEditor";
import Whiteboard from "../../components/InterviewRoom/WhiteBoard";
import VideoCall from "../../components/InterviewRoom/VideoCall";
import InterviewNotes from "../../components/InterviewRoom/InterviewNotes";
import InterviewControls from "../../components/InterviewRoom/InterviewControls";
import ResizeHandle from "../../components/InterviewRoom/ResizeHandlers";
import QuestionBank from "../../components/InterviewRoom/QuestionBank"
import { candidateInfo, languages } from "../../Data/InterviewData";
import { useSearchParams,useParams } from "react-router-dom";
import axios from "axios";
import { initiateSocket, disconnectSocket, subscribeToCodeChanges, sendCodeChange ,sendLanguageChange, subscribeToLanguageChange,subscribeToCodeOutput,sendQuestion  } from "../../sockets/CodeSocket";



const InterviewRoom = () => {
  // State management
  const [code, setCode] = useState('// Welcome to the coding interview!\n// The candidate can start coding here...\n\n');
  const [output, setOutput] = useState('Console ready for code execution...\nWaiting for candidate to run code.\n\n');
  const [questions, setQuestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [isCodeLocked, setIsCodeLocked] = useState(false);
  const [timer, setTimer] = useState({ elapsed: 0, remaining: 3600 });
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isInterviewerVideoOn, setIsInterviewerVideoOn] = useState(true);
  const [isInterviewerAudioOn, setIsInterviewerAudioOn] = useState(true);
  const [isWhiteboardFullscreen, setIsWhiteboardFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isResizing, setIsResizing] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [panels, setPanels] = useState({
    leftSidebar: 320,
    codeEditor: 50,
    whiteboard: 50,
    rightSidebar: 300
  });


const { id } = useParams(); 
const [searchParams] = useSearchParams();
const candidateId = searchParams.get("candidateId");



  // Refs
  const containerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => ({
        elapsed: prev.elapsed + 1,
        remaining: Math.max(0, prev.remaining - 1)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Resizing functionality
  const startResize = useCallback((panel) => {
    setIsResizing(panel);
  }, []);

  const handleResize = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    
    setPanels(prev => {
      const newPanels = { ...prev };
      
      if (isResizing === 'leftSidebar') {
        newPanels.leftSidebar = Math.max(250, Math.min(450, mouseX));
      } else if (isResizing === 'codeEditor') {
        const availableWidth = containerWidth - newPanels.leftSidebar - newPanels.rightSidebar;
        const codeEditorWidth = mouseX - newPanels.leftSidebar;
        const percentage = (codeEditorWidth / availableWidth) * 100;
        newPanels.codeEditor = Math.max(30, Math.min(70, percentage));
        newPanels.whiteboard = 100 - newPanels.codeEditor;
      } else if (isResizing === 'rightSidebar') {
        newPanels.rightSidebar = Math.max(250, Math.min(400, containerWidth - mouseX));
      }
      
      return newPanels;
    });
  }, [isResizing]);

  const stopResize = useCallback(() => {
    setIsResizing(null);
  }, []);

   useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token"); 
      try {
        const response = await axios.get("http://localhost:4000/api/questions", {
          headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
  const roomId = id; 
  if (!roomId) return;

  initiateSocket(roomId); 

  subscribeToCodeChanges((newCode) => {
    setCode(newCode);
  });

  return () => {
    disconnectSocket();
  };
}, [id]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, handleResize, stopResize]);

const insertQuestion = (question) => {
  const commentSymbol = selectedLanguage === "python" ? "#" : "//";

  const questionTemplate = `${commentSymbol} Question: ${question.title}
${commentSymbol} Category: ${question.category}
${commentSymbol} Difficulty: ${question.difficulty}
${commentSymbol} Estimated time: ${question.timeEstimate}

${commentSymbol} ${question.question}

${commentSymbol} Start coding below:

`;

  setCode(questionTemplate);

  sendCodeChange(id, questionTemplate);
  sendQuestion(id, question);

  setOutput(
    `Question loaded: ${question.title}\nCategory: ${question.category}\nDifficulty: ${question.difficulty}\nEstimated time: ${question.timeEstimate}\n\nReady for execution...\n`
  );
};


// language change
useEffect(() => {
  if (!id) return;
  
  const unsubscribe = subscribeToLanguageChange((newLang) => {
    console.log("Parent received language change:", newLang);
    setSelectedLanguage(newLang); 
  });

  return unsubscribe;
}, [id]);

// output

useEffect(() => {
  if (!id) return;

  let unsubscribe = () => {};
  try {
    unsubscribe = subscribeToCodeOutput((newOutput) => {
      console.log("Parent received code output:", newOutput);
      setOutput(prev => (prev || '') + "\n" + newOutput);
      setIsExecuting(false);
    });
  } catch (err) {
    console.error("Error subscribing to code output:", err);
  }

  return () => unsubscribe();
}, [id]);




  return (
    <div className={`w-screen h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} select-none`}>
      {/* Header */}
      <Header 
        timer={timer} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Left Sidebar */}
        <div 
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col shadow-lg`}
          style={{ width: `${panels.leftSidebar}px` }}
        >
          <CandidateProfile  candidateId={candidateId} isDarkMode={isDarkMode} />
          <QuestionBank 
            questions={questions} 
            onInsertQuestion={insertQuestion} 
            isDarkMode={isDarkMode} 
          />
        </div>

        <ResizeHandle direction="leftSidebar" onMouseDown={startResize} isDarkMode={isDarkMode} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex">
            <CodeEditor
              code={code}
              setCode={setCode}
              output={output}
              setOutput={setOutput}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              isCodeLocked={isCodeLocked}
              setIsCodeLocked={setIsCodeLocked}
              languages={languages}
              isDarkMode={isDarkMode}
              panelWidth={panels.codeEditor}
              role="interviewer"
              roomId={id}
              sendLanguageChange={sendLanguageChange}
              isExecuting={isExecuting}
              setIsExecuting={setIsExecuting}
            />

            <ResizeHandle direction="codeEditor" onMouseDown={startResize} isDarkMode={isDarkMode} />

            <Whiteboard
              isDarkMode={isDarkMode}
              panelWidth={panels.whiteboard}
              isWhiteboardFullscreen={isWhiteboardFullscreen}
              setIsWhiteboardFullscreen={setIsWhiteboardFullscreen}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              roomId={id}
            />
          </div>
        </div>

        <ResizeHandle direction="rightSidebar" onMouseDown={startResize} isDarkMode={isDarkMode} />

        {/* Right Sidebar */}
        <div 
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l flex flex-col shadow-lg`}
          style={{ width: `${panels.rightSidebar}px` }}
        >
          <VideoCall
            candidateInfo={candidateInfo}
            isVideoOn={isVideoOn}
            setIsVideoOn={setIsVideoOn}
            isAudioOn={isAudioOn}
            setIsAudioOn={setIsAudioOn}
            isInterviewerVideoOn={isInterviewerVideoOn}
            setIsInterviewerVideoOn={setIsInterviewerVideoOn}
            isInterviewerAudioOn={isInterviewerAudioOn}
            setIsInterviewerAudioOn={setIsInterviewerAudioOn}
            isDarkMode={isDarkMode}
            roomId={id}
          />
          
          <InterviewNotes isDarkMode={isDarkMode} />
          
          <InterviewControls isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;