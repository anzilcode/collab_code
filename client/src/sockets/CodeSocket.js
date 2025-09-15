import { io } from "socket.io-client";

let socket;

export const initiateSocket = (roomId) => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      transports: ["websocket"], // prevent polling fallback
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      if (roomId) {
        socket.emit("join-room", { roomId });
        console.log("Joined room:", roomId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // reset so it can reconnect cleanly
    console.log("Socket fully disconnected");
  }
};

// Subscribe to code changes
export const subscribeToCodeChanges = (callback) => {
  if (!socket) return () => {};

  const handler = ({ code }) => {
    console.log("Received code from socket:", code);
    callback(code);
  };

  socket.on("code-change", handler);

  // Return unsubscribe function for cleanup
  return () => {
    socket.off("code-change", handler);
  };
};

export const toggleEditorLock = (roomId, locked) => {
  if (!socket) return;
  console.log("Emitting editor-lock:", roomId, locked);
  socket.emit("editor-lock", { roomId, locked });
};

export const subscribeToEditorLock = (callback) => {
  if (!socket) return () => {};

  const handler = ({ locked }) => {
    console.log("Received editor-lock:", locked);
    callback(locked);
  };

  socket.on("editor-lock", handler);

  return () => {
    socket.off("editor-lock", handler);
  };
};

export const sendLanguageChange = (language, roomId) => {
  if (!socket) return;
  socket.emit("language-change", { roomId, language });
};

export const subscribeToLanguageChange = (callback) => {
  if (!socket) return () => {};

  const handler = ({ language }) => {
    callback(language);
  };

  socket.on("language-change", handler);

  return () => {
    console.log("Unsubscribing from language-change");
    if (socket) socket.off("language-change", handler);
  };
};



// Send code changes
export const sendCodeChange = (code, roomId) => {
  if (!socket) return;
  socket.emit("code-change", { roomId, code });
};


export const subscribeToCodeOutput = (callback) => {
  if (!socket) return () => {};

  console.log("🔌 subscribeToCodeOutput called, setting up listener");

  const handler = ({ output }) => {
    console.log("📡 socket received code-output:", output);
    callback(output);
  };

  socket.on("code-output", handler);

  return () => {
    console.log("Unsubscribing from code-output");
    if (socket) socket.off("code-output", handler); // <- safe now
  };
};



// Send code to run on the backend
export const sendRunCode = (code, language, roomId) => {
  if (!socket) return;
  console.log("Emitting run-code:", { code, language, roomId });
  socket.emit("run-code", { code, language, roomId });
};

// send a full question object to the server (and room)
export const sendQuestion = (roomId, question) => {
  if (!socket) return;
  socket.emit("sendQuestion", { roomId, question });
};

export const subscribeToQuestion = (cb) => {
  if (!socket) return () => {};
  const handler = (question) => {
    cb(question); 
  };
  socket.on("receiveQuestion", handler);

  return () => {
    if (socket) socket.off("receiveQuestion", handler); 
  };
};


// Emit whiteboard draw
export const sendWhiteboardDraw = (roomId, drawData) => {
  if (!socket) return;
  socket.emit("whiteboard-draw", { roomId, drawData });
};

// Subscribe to whiteboard draw
export const subscribeToWhiteboardDraw = (callback) => {
  if (!socket) return () => {};

  const handler = (drawData) => {
    console.log("📡 Received whiteboard-draw:", drawData);
    callback(drawData);
  };

  socket.on("whiteboard-draw", handler);

  return () => {
    if (socket) socket.off("whiteboard-draw", handler);
  };
};

// Emit whiteboard clear
export const sendWhiteboardClear = (roomId) => {
  if (!socket) return;
  socket.emit("whiteboard-clear", { roomId });
};

// Subscribe to whiteboard clear
export const subscribeToWhiteboardClear = (callback) => {
  if (!socket) return () => {};

  const handler = () => {
    callback();
  };

  socket.on("whiteboard-clear", handler);

  return () => {
    if (socket) socket.off("whiteboard-clear", handler);
  };
};


// Emit signaling data to other peer
export const sendVideoSignal = (roomId, signalData, from) => {
  if (!socket) return;
  socket.emit("video-signal", { roomId, signalData, from });
};

// Subscribe to signaling data from other peer
export const subscribeToVideoSignal = (callback) => {
  if (!socket) return () => {}; // Return no-op function
  
  const activeSocket = socket;
  const handler = ({ signalData, from }) => {
    callback(signalData, from);
  };
  
  activeSocket.on("video-signal", handler);
  
  // Enhanced cleanup with better error handling
  return () => {
    try {
      if (activeSocket && 
          typeof activeSocket.off === "function" && 
          !activeSocket.disconnected) {
        activeSocket.off("video-signal", handler);
      }
    } catch (error) {
      console.warn('Socket cleanup error:', error);
    }
  };
};

// Emit ICE candidate to other peer
export const sendIceCandidate = (roomId, candidate) => {
  if (!socket) return;
  socket.emit("ice-candidate", { roomId, candidate });
};

// Subscribe to ICE candidates from other peer
export const subscribeToIceCandidate = (callback) => {
  if (!socket) return () => {};

  const handler = ({ candidate }) => {
    if (candidate) {
      callback(candidate);
    }
  };

  socket.on("ice-candidate", handler);

  return () => {
    if (socket) socket.off("ice-candidate", handler);
  };
};









