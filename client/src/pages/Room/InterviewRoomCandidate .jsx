import { useState ,useEffect} from 'react';
import Header from '../../components/CandidateRoom.jsx/Header';
import InterviewDetails from '../../components/CandidateRoom.jsx/Interviewetals';
import VideoCall from '../../components/CandidateRoom.jsx/VideoCall';
import TopNavigation from '../../components/CandidateRoom.jsx/TopNavigation';
import CodeEditor from '../../components/CandidateRoom.jsx/CodeEditor';
import Whiteboard from '../../components/CandidateRoom.jsx/WhiteBoard';
import { useParams } from 'react-router-dom';
import { initiateSocket, disconnectSocket, subscribeToCodeChanges, sendCodeChange,subscribeToLanguageChange,subscribeToEditorLock,subscribeToCodeOutput ,subscribeToQuestion  } from "../../sockets/CodeSocket";


export default function CandidateInterface() {
  const [activeTab, setActiveTab] = useState('code');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isInterviewerMicOn, setIsInterviewerMicOn] = useState(true);
  const [isInterviewerVideoOn, setIsInterviewerVideoOn] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isCodeLocked, setIsCodeLocked] = useState(false);
  const panelWidth = 100; // Adjust if needed
  const parentDarkMode = true; // or false based on theme

  // whiteboard
  const [isWhiteboardFullscreen, setIsWhiteboardFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(3);


  // Code editor states
  const [code, setCode] = useState(`// Welcome to your coding interview!
// You can start coding here...
`);

const { id } = useParams(); 


useEffect(() => {
  const roomId = id;
  if (!roomId) return;

  initiateSocket(roomId);

  const unsubscribeCode = subscribeToCodeChanges((newCode) => {
    setCode(newCode);
  });

  const unsubscribeLang = subscribeToLanguageChange((newLang) => {
    setSelectedLanguage(newLang);
  });

  const unsubscribeLock = subscribeToEditorLock((locked) => {
    console.log("Candidate received lock:", locked);
    setIsCodeLocked(locked);
  });

  const unsubscribeOutput = subscribeToCodeOutput((newOutput) => {
    console.log("Candidate received OUTPUT:", newOutput);
    setOutput((prev) => prev + newOutput + "\n");
  });

  return () => {
    unsubscribeCode();
    unsubscribeLang();
    unsubscribeLock();
    unsubscribeOutput();
    disconnectSocket();
  };
}, [id]);


useEffect(() => {
  if (!id) return;

  const unsubscribe = subscribeToQuestion((newQuestion) => {
    const commentSymbol = selectedLanguage === "python" ? "#" : "//";

    const questionTemplate = `${commentSymbol} Question: ${newQuestion.title}
${commentSymbol} Category: ${newQuestion.category}
${commentSymbol} Difficulty: ${newQuestion.difficulty}
${commentSymbol} Estimated time: ${newQuestion.timeEstimate}

${commentSymbol} ${newQuestion.question}

${commentSymbol} Start coding below:

`;

    setCode(questionTemplate); 
    setOutput(
      `Question loaded: ${newQuestion.title}\nCategory: ${newQuestion.category}\nDifficulty: ${newQuestion.difficulty}\nEstimated time: ${newQuestion.timeEstimate}\n\nReady for execution...\n`
    );
  });

  return () => unsubscribe();
}, [id, selectedLanguage]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex">
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <Header />
        <InterviewDetails />
        <VideoCall 
          isVideoOn={isVideoOn}
          setIsVideoOn={setIsVideoOn}
          isMicOn={isMicOn}
          setIsMicOn={setIsMicOn}
          isInterviewerVideoOn={isInterviewerVideoOn}
          setIsInterviewerVideoOn={setIsInterviewerVideoOn}
          isInterviewerMicOn={isInterviewerMicOn}
          setIsInterviewerMicOn={setIsInterviewerMicOn}
          roomId={id}
        />
        <div className="flex-1"></div>
      </div>

      <div className="flex-1 flex flex-col">
        <TopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex">
          {activeTab === 'code' ? (
            <CodeEditor
              code={code}
              setCode={setCode}
              output={output}
              setOutput={setOutput}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              isCodeLocked={isCodeLocked}
              setIsCodeLocked={setIsCodeLocked}
              isDarkMode={parentDarkMode}
              panelWidth={panelWidth}
               roomId={id}
            />
          ) : (
            <Whiteboard 
                isDarkMode={parentDarkMode}
                panelWidth={panelWidth}
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
          )}
        </div>
      </div>
    </div>
  );
}
