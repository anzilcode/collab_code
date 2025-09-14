import axios from "axios";

const PISTON_API = process.env.PISTON_API

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("join-room", ({ roomId }) => {
      const clients = io.sockets.adapter.rooms.get(roomId); 
      const numClients = clients ? clients.size : 0;

      if (numClients >= 2) {
        console.log(`Room ${roomId} already has 2 participants. Disconnecting ${socket.id}`);
        socket.disconnect(true); 
        return;
      }

      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

      socket.on("code-change", (data) => {
        socket.to(data.roomId).emit("code-change", { code: data.code });
      });

    socket.on("editor-lock", ({ roomId, locked }) => {
      console.log(` Server received lock event: room=${roomId}, locked=${locked}`);
      socket.to(roomId).emit("editor-lock", { locked });
  });

  socket.on("language-change", ({ roomId, language }) => {
    console.log(`Server received language change: ${language} for room ${roomId}`);
    socket.to(roomId).emit("language-change", { language });
  });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });

    const languageMap = {
      javascript: "javascript",
      python: "python3",
      c: "c",
      cpp: "cpp17",
      java: "java"
    };

  socket.on("run-code", async ({ roomId, code, language }) => {
     console.log("Received run-code event:", { roomId, language, codeSnippet: code });
  try {
    const response = await axios.post(PISTON_API, {
      language: languageMap[language] || "javascript",
      version: "*", 
      files: [
        { name: "main", content: code }
      ]
    });

    console.log("Raw Piston API response:", JSON.stringify(response.data, null, 2));
    const output = response.data.run.output; 
    io.to(roomId).emit("code-output", { output });


  } catch (err) {
    console.error("Error executing code:", err);
    io.to(roomId).emit("code-output", { 
      output: `Error executing code: ${err.message}` 
    });
  }
});

  socket.on("sendQuestion", ({ roomId, question }) => {
    socket.to(roomId).emit("receiveQuestion", question);
  });

  // whiteboard
socket.on("whiteboard-draw", ({ roomId, drawData }) => {
  io.in(roomId).emit("whiteboard-draw", drawData); 
});

socket.on("whiteboard-clear", ({ roomId }) => {
  io.in(roomId).emit("whiteboard-clear");
});


// VIDEO CALL SIGNALING 
socket.on("video-signal", ({ roomId, signalData, from }) => {
  socket.to(roomId).emit("video-signal", { signalData, from });
});

  });
};
