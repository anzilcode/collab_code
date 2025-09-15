import { Video, VideoOff, Mic, MicOff, Maximize, Minimize } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { 
  createPeerConnection,
  addLocalStream,
  createOffer,
  createAnswer,
  setRemoteDescription,
  addIceCandidate
} from "../../sockets/RtcService";
import { sendVideoSignal, subscribeToVideoSignal } from "../../sockets/CodeSocket";

const VideoCall = ({ 
  candidateInfo, 
  isVideoOn, 
  setIsVideoOn, 
  isAudioOn, 
  setIsAudioOn, 
  isInterviewerVideoOn, 
  setIsInterviewerVideoOn, 
  isInterviewerAudioOn, 
  setIsInterviewerAudioOn, 
  isDarkMode,
  roomId // Make sure this prop is passed from parent
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const candidateVideoRef = useRef(null);
  const interviewerVideoRef = useRef(null);

useEffect(() => {
  const pcRef = { current: null }; // temporary ref-like object
  console.log("Interviewer initializing, roomId:", roomId);


  // 1. Get local media
  navigator.mediaDevices.getUserMedia({
    video: isInterviewerVideoOn,
    audio: isInterviewerAudioOn
  })
  .then(async (stream) => {
    setLocalStream(stream);

    if (interviewerVideoRef.current) {
      interviewerVideoRef.current.srcObject = stream;
    }

    // Create PeerConnection and store it in pcRef
    const pc = createPeerConnection((remoteStream) => {
      if (candidateVideoRef.current) {
        candidateVideoRef.current.srcObject = remoteStream;
      }
    });
    pcRef.current = pc;

    // Add local stream
    addLocalStream(pc, stream);

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && roomId) {
        sendVideoSignal(roomId, {
          type: "ice-candidate",
          candidate: event.candidate
        }, "interviewer");
      }
    };

    // Send offer
    try {
      const offer = await createOffer(pc);
      console.log("Interviewer sending offer:", offer);
      if (roomId) {
        sendVideoSignal(roomId, { type: "offer", sdp: offer }, "interviewer");
         console.log("Offer sent to room:", roomId);
      }
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  })
  .catch((err) => console.error("Error accessing media devices:", err));

  // 2. Handle incoming signals
  const unsubscribe = subscribeToVideoSignal(async (signalData) => {
    const pc = pcRef.current;
    if (!pc) return;

    if (signalData.type === "answer") {
      await setRemoteDescription(pc, signalData.sdp);
    } else if (signalData.type === "ice-candidate") {
      await addIceCandidate(pc, signalData.candidate);
    }
  });

  return () => {
    unsubscribe();
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
    }
  };
}, [roomId, isInterviewerVideoOn, isInterviewerAudioOn]);


useEffect(() => {
  if (!localStream) return;

  // Toggle video tracks
  localStream.getVideoTracks().forEach(track => {
    track.enabled = Boolean(isInterviewerVideoOn);
  });

  // Toggle audio tracks
  localStream.getAudioTracks().forEach(track => {
    track.enabled = Boolean(isInterviewerAudioOn);
  });
}, [isInterviewerVideoOn, isInterviewerAudioOn, localStream]);


  if (isFullscreen) {
    return (
      <div className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-black'} flex items-center justify-center`}>
        {/* Main candidate video - fullscreen */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-center">
            {isVideoOn ? (
              <video
                ref={candidateVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover max-w-4xl max-h-[80vh] rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-6xl mb-4 mx-auto">
                👩‍💻
              </div>
            )}
            <div className="text-2xl font-medium text-white mb-2">{candidateInfo.name}</div>
            <div className="text-lg text-gray-400">Live Video Feed</div>
          </div>
          {!isVideoOn && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <VideoOff className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Interviewer video overlay - top right */}
        <div className="absolute top-4 right-4 w-48 h-32">
          <div className={`w-full h-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'} rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-gray-600`}>
            {isInterviewerVideoOn ? (
              <video
                ref={interviewerVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto">
                  👨‍💼
                </div>
                <div className="text-sm font-medium text-white">You (Interviewer)</div>
              </div>
            )}
            {!isInterviewerVideoOn && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-white" />
              </div>
            )}
            {!isInterviewerAudioOn && (
              <div className="absolute top-2 right-2">
                <div className="bg-red-500 rounded-full p-1">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls overlay - bottom center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-full px-6 py-4">
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-all ${
                isVideoOn 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg hover:shadow-xl`}
              title={`${isVideoOn ? 'Hide' : 'Show'} Candidate Video`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3 rounded-full transition-all ${
                isAudioOn 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg hover:shadow-xl`}
              title={`${isAudioOn ? 'Mute' : 'Unmute'} Candidate Audio`}
            >
              {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <div className="w-px h-8 bg-gray-400"></div>

            <button
              onClick={() => setIsInterviewerVideoOn(!isInterviewerVideoOn)}
              className={`p-2 rounded transition-all ${
                isInterviewerVideoOn 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={`${isInterviewerVideoOn ? 'Turn Off' : 'Turn On'} Your Video`}
            >
              {isInterviewerVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setIsInterviewerAudioOn(!isInterviewerAudioOn)}
              className={`p-2 rounded transition-all ${
                isInterviewerAudioOn 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={`${isInterviewerAudioOn ? 'Mute' : 'Unmute'} Your Audio`}
            >
              {isInterviewerAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <div className="w-px h-8 bg-gray-400"></div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-all shadow-lg hover:shadow-xl"
              title="Exit Fullscreen"
            >
              <Minimize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Video className="w-4 h-4 mr-2 text-blue-400" />
          Candidate Video
        </h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-lg"
            title="Enter Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-400">Connected</span>
          </div>
        </div>
      </div>
      
      <div className={`w-full h-48 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}>
        {isVideoOn ? (
          <video
            ref={candidateVideoRef}   
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-3xl mb-2 mx-auto">
              👩‍💻
            </div>
            <div className="text-sm font-medium">{candidateInfo.name}</div>
            <div className="text-xs text-gray-400">Live Video Feed</div>
          </div>
        )}
        {!isVideoOn && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-3 mb-4">
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full transition-all ${
            isVideoOn 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          } shadow-lg hover:shadow-xl`}
          title={`${isVideoOn ? 'Hide' : 'Show'} Candidate Video`}
        >
          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsAudioOn(!isAudioOn)}
          className={`p-3 rounded-full transition-all ${
            isAudioOn 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          } shadow-lg hover:shadow-xl`}
          title={`${isAudioOn ? 'Mute' : 'Unmute'} Candidate Audio`}
        >
          {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Interviewer Video (Small) */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400">Your Video:</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsInterviewerVideoOn(!isInterviewerVideoOn)}
            className={`p-1.5 rounded transition-all ${
              isInterviewerVideoOn 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={`${isInterviewerVideoOn ? 'Turn Off' : 'Turn On'} Your Video`}
          >
            {isInterviewerVideoOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsInterviewerAudioOn(!isInterviewerAudioOn)}
            className={`p-1.5 rounded transition-all ${
              isInterviewerAudioOn 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={`${isInterviewerAudioOn ? 'Mute' : 'Unmute'} Your Audio`}
          >
            {isInterviewerAudioOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          </button>
        </div>
      </div>
      <div className={`w-full h-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center relative overflow-hidden`}>
        {isInterviewerVideoOn ? (
          <video
            ref={interviewerVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-lg mb-1 mx-auto">
              👨‍💼
            </div>
            <div className="text-xs font-medium">You (Interviewer)</div>
          </div>
        )}
        {!isInterviewerVideoOn && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <VideoOff className="w-4 h-4 text-white" />
          </div>
        )}
        {!isInterviewerAudioOn && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 rounded-full p-1">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;