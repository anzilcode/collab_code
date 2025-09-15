import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Maximize2, Minimize2 } from 'lucide-react';
import { 
  createPeerConnection, 
  addLocalStream, 
  createOffer, 
  createAnswer, 
  setRemoteDescription, 
  addIceCandidate 
} from '../../sockets/RtcService';
import { sendVideoSignal, subscribeToVideoSignal } from '../../sockets/CodeSocket';

const VideoCall = ({ 
  isVideoOn, 
  setIsVideoOn, 
  isMicOn, 
  setIsMicOn, 
  isInterviewerVideoOn, 
  setIsInterviewerVideoOn, 
  isInterviewerMicOn, 
  setIsInterviewerMicOn,
  roomId
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const candidateVideoRef = useRef(null); 
  const yourVideoRef = useRef(null); 
  const interviewerVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isStreamReady, setIsStreamReady] = useState(false);

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  useEffect(() => {

 const initializeVideo = async () => {
  console.log("Candidate ready for signals, roomId:", roomId);

  let pc;
  let stream;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: isVideoOn,
      audio: isMicOn
    });
    setLocalStream(stream);
    setIsStreamReady(true);

    if (yourVideoRef.current) yourVideoRef.current.srcObject = stream;
  } catch (err) {
    console.warn("Could not access local media, continuing without it:", err);
    setIsStreamReady(false); // optional, just to know
  }

  // Create peer connection regardless of local camera
  pc = createPeerConnection((remoteStream) => {
    if (interviewerVideoRef.current) interviewerVideoRef.current.srcObject = remoteStream;
    setIsInterviewerVideoOn(true);
  });

  // If we have local stream, add tracks
  if (stream) addLocalStream(pc, stream);

  // ICE candidate handling
  pc.onicecandidate = (event) => {
    if (event.candidate && roomId) {
      sendVideoSignal(roomId, { type: 'ice-candidate', candidate: event.candidate }, 'candidate');
    }
  };

  // Subscribe to signaling
  console.log("Candidate subscribing to video signals");
  const unsubscribe = subscribeToVideoSignal(async (signalData) => {
    console.log("Candidate received signal:", signalData);

    if (!pc) return;

    if (signalData.type === 'offer') {
      await setRemoteDescription(pc, signalData.sdp);
      const answer = await createAnswer(pc);
      if (roomId) sendVideoSignal(roomId, { type: 'answer', sdp: answer }, 'candidate');
    } else if (signalData.type === 'ice-candidate') {
      await addIceCandidate(pc, signalData.candidate);
    }
  });

  // Cleanup
  return () => {
    unsubscribe();
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (pc) pc.close();
  };
};


const cleanupPromise = initializeVideo();

  return () => {
    cleanupPromise.then(cleanup => cleanup && cleanup());
  };
}, [roomId]);



  useEffect(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      const audioTracks = localStream.getAudioTracks();
      
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = isVideoOn;
        });
      }
      
      if (audioTracks.length > 0) {
        audioTracks.forEach(track => {
          track.enabled = isMicOn;
        });
      }

      // Update the video display based on video state
      if (yourVideoRef.current) {
        if (isVideoOn) {
          yourVideoRef.current.srcObject = localStream;
        } else {
          yourVideoRef.current.srcObject = null;
        }
      }
    }
  }, [isVideoOn, isMicOn, localStream]);

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Main fullscreen view - Interviewer */}
        <div className="relative w-full h-full">
          {isInterviewerVideoOn ? (
            <video
              ref={interviewerVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-6xl mb-6 mx-auto">
                  👨‍💼
                </div>
                <div className="text-2xl font-medium text-white mb-2">John Doe</div>
                <div className="text-lg text-gray-400">Interviewer Video Feed</div>
              </div>
            </div>
          )}
          
          {!isInterviewerVideoOn && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <VideoOff className="w-16 h-16 text-white" />
            </div>
          )}
          
          {!isInterviewerMicOn && (
            <div className="absolute top-8 right-8">
              <div className="bg-red-500 rounded-full p-3">
                <MicOff className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Your video overlay - top right */}
        <div className="absolute top-4 right-4 w-48 h-32 bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
          {isVideoOn && isStreamReady ? (
            <video
              ref={yourVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-2xl mb-1 mx-auto">
                  👩‍💻
                </div>
                <div className="text-xs font-medium text-white">You</div>
              </div>
            </div>
          )}
          {!isVideoOn && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <VideoOff className="w-6 h-6 text-white" />
            </div>
          )}
          {!isMicOn && (
            <div className="absolute top-2 right-2">
              <div className="bg-red-500 rounded-full p-1">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Controls - bottom center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black/60 backdrop-blur-sm rounded-full px-6 py-4">
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-all ${
                isVideoOn 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg hover:shadow-xl`}
              title={`${isVideoOn ? 'Turn Off' : 'Turn On'} Your Video`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-all ${
                isMicOn 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } shadow-lg hover:shadow-xl`}
              title={`${isMicOn ? 'Mute' : 'Unmute'} Your Audio`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <div className="w-px h-8 bg-gray-400"></div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-all shadow-lg hover:shadow-xl"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular view
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Video className="w-4 h-4 mr-2 text-blue-400" />
          Interviewer Video
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-400">Connected</span>
          </div>
          <button
            onClick={toggleFullScreen}
            className="p-1 rounded hover:bg-gray-700 transition"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      {/* Interviewer view */}
      <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden transition-all duration-500">
        {isInterviewerVideoOn ? (
          <video
            ref={interviewerVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto">
              👨‍💼
            </div>
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-gray-400">Live Video Feed</div>
          </div>
        )}
        {!isInterviewerVideoOn && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <VideoOff className="w-8 h-8 text-white" />
          </div>
        )}
        {!isInterviewerMicOn && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 rounded-full p-1">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Connection status */}
      <div className="flex justify-center space-x-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>Interviewer Connected</span>
        </div>
      </div>
      
      {/* Your video */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400">Your Video:</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-1.5 rounded transition-all ${
              isVideoOn 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={`${isVideoOn ? 'Turn Off' : 'Turn On'} Your Video`}
          >
            {isVideoOn ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-1.5 rounded transition-all ${
              isMicOn 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={`${isMicOn ? 'Mute' : 'Unmute'} Your Audio`}
          >
            {isMicOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          </button>
        </div>
      </div>
      <div className="w-full h-24 bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-500">
        {isVideoOn && isStreamReady ? (
          <video
            ref={yourVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-lg mb-1 mx-auto">
              👩‍💻
            </div>
            <div className="text-xs font-medium">You (Candidate)</div>
          </div>
        )}
        {!isVideoOn && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <VideoOff className="w-4 h-4 text-white" />
          </div>
        )}
        {!isMicOn && (
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