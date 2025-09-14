import { useRef, useEffect, useState } from "react";
import { 
  PenTool, 
  RotateCcw, 
  Camera, 
  Minimize2, 
  Maximize2, 
  Edit3, 
  Palette, 
  Eraser
} from "lucide-react";

import { 
  sendWhiteboardDraw, 
  subscribeToWhiteboardDraw, 
  sendWhiteboardClear, 
  subscribeToWhiteboardClear,
  initiateSocket
} from "../../sockets/CodeSocket";

const Whiteboard = ({ 
  roomId,
  panelWidth,
  isWhiteboardFullscreen,
  setIsWhiteboardFullscreen,
  selectedTool,
  setSelectedTool,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize
}) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);

  // Initialize socket once
  useEffect(() => {
    if (!roomId || initialized) return;
    initiateSocket(roomId);
    setInitialized(true);
  }, [roomId, initialized]);

  // Resize canvas and preserve content
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      requestAnimationFrame(() => {
        const container = isWhiteboardFullscreen ? document.body : canvas.parentElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCanvas.getContext("2d").drawImage(canvas, 0, 0);

        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Only draw previous content if tempCanvas had something
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
      });
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(isWhiteboardFullscreen ? document.body : canvas.parentElement);

    return () => observer.disconnect();
  }, [isWhiteboardFullscreen]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  // Local drawing
  const startDrawing = (e) => {
    if (!canvasRef.current || selectedTool === "select") return;
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = getCanvasCoordinates(e);
  };

  const draw = (e) => {
    if (!isDrawing.current || !canvasRef.current) return;
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");

    ctx.globalCompositeOperation = selectedTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = selectedTool === "eraser" ? undefined : brushColor;
    ctx.lineWidth = selectedTool === "eraser" ? brushSize * 3 : brushSize;
    ctx.globalAlpha = selectedTool === "highlighter" ? 0.3 : 1;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Emit the draw event to socket
    if (roomId) {
      sendWhiteboardDraw(roomId, {
        x1: lastPoint.current.x,
        y1: lastPoint.current.y,
        x2: coords.x,
        y2: coords.y,
        color: brushColor,
        size: brushSize,
        tool: selectedTool
      });
    }

    lastPoint.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (roomId) sendWhiteboardClear(roomId);
  };

  const takeWhiteboardSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `whiteboard-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Subscribe to remote drawing
  useEffect(() => {
    if (!roomId) return;

    const unsubscribeDraw = subscribeToWhiteboardDraw((drawData) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = drawData.tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = drawData.tool === "eraser" ? undefined : drawData.color;
      ctx.lineWidth = drawData.size;
      ctx.globalAlpha = drawData.tool === "highlighter" ? 0.3 : 1;

      ctx.beginPath();
      ctx.moveTo(drawData.x1, drawData.y1);
      ctx.lineTo(drawData.x2, drawData.y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    const unsubscribeClear = subscribeToWhiteboardClear(() => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    });

    return () => {
      unsubscribeDraw();
      unsubscribeClear();
    };
  }, [roomId]);

  // Toolbar
  const Toolbar = (
    <div className="p-4 border-b flex flex-col space-y-3 bg-gray-900 text-white bg-opacity-90 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PenTool className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold">{isWhiteboardFullscreen ? 'Fullscreen Board' : 'Collaborative Board'}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={clearCanvas} className="p-2 rounded-lg hover:bg-gray-700" title="Clear Whiteboard">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={takeWhiteboardSnapshot} className="p-2 rounded-lg hover:bg-gray-700" title="Snapshot">
            <Camera className="w-4 h-4" />
          </button>
          <button onClick={() => setIsWhiteboardFullscreen(!isWhiteboardFullscreen)} className="p-2 rounded-lg hover:bg-gray-700" title="Toggle Fullscreen">
            {isWhiteboardFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          {[{ tool: "pen", icon: Edit3, name: "Pen" },
            { tool: "highlighter", icon: Palette, name: "Highlighter" },
            { tool: "eraser", icon: Eraser, name: "Eraser" },
          ].map(({ tool, icon: Icon, name }) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`p-2 rounded-lg transition-all ${selectedTool === tool ? "bg-blue-500 text-white shadow-md" : "bg-gray-800 hover:bg-gray-700 text-white"}`}
              title={name}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" title="Brush Color" />
          <input type="range" min="1" max="10" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-20" title={`Brush Size: ${brushSize}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-gray-900 text-white" style={{ width: `${panelWidth}%` }}>
      {!isWhiteboardFullscreen && Toolbar}

      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 cursor-crosshair transition-all duration-300 ${isWhiteboardFullscreen ? "fixed inset-0 z-40" : ""}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onContextMenu={(e) => e.preventDefault()}
          style={{ backgroundColor: "#000000", width: "100%", height: "100%" }}
        />

        {isWhiteboardFullscreen && (
          <div className="fixed inset-0 z-50 flex flex-col pointer-events-none">
            <div className="pointer-events-auto">
              {Toolbar}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
