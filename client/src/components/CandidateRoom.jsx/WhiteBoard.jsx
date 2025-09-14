import { useRef, useEffect, useState } from "react";
import { 
  PenTool, 
  RotateCcw, 
  Camera, 
  Edit3, 
  Palette, 
  Eraser
} from "lucide-react";

import { 
  sendWhiteboardDraw, 
  subscribeToWhiteboardDraw, 
  sendWhiteboardClear, 
  subscribeToWhiteboardClear 
} from "../../sockets/CodeSocket";

const Whiteboard = ({ 
  roomId,
  panelWidth,
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
  const [hasDrawn, setHasDrawn] = useState(false);

  // Resize canvas and preserve content
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext("2d").drawImage(canvas, 0, 0);

      canvas.width = rect.width;
      canvas.height = rect.height;

      ctx.fillStyle = "#000000"; // Dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas.parentElement);

    return () => observer.disconnect();
  }, []);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    if (!canvasRef.current || selectedTool === "select") return;
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = getCanvasCoordinates(e);
    if (!hasDrawn) setHasDrawn(true);
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

    if (roomId)
     {
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
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);

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

  // Socket subscriptions for receiving drawings & clear events
  useEffect(() => {
    if (!roomId) return;

    const unsubscribeDraw = subscribeToWhiteboardDraw((drawData) => {
      const ctx = canvasRef.current.getContext("2d");
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
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasDrawn(false);
    });

    return () => {
      unsubscribeDraw();
      unsubscribeClear();
    };
  }, [roomId]);

  // Toolbar
  const Toolbar = (
    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
      <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
        {[{ tool: "pen", icon: Edit3, name: "Pen" },
          { tool: "highlighter", icon: Palette, name: "Highlighter" },
          { tool: "eraser", icon: Eraser, name: "Eraser" },
        ].map(({ tool, icon: Icon, name }) => (
          <button
            key={tool}
            onClick={() => setSelectedTool(tool)}
            className={`p-2 rounded-md transition-all ${selectedTool === tool ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 hover:bg-gray-700 text-white"}`}
            title={name}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}

        <button onClick={clearCanvas} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" title="Clear Whiteboard">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={takeWhiteboardSnapshot} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" title="Snapshot">
          <Camera className="w-4 h-4" />
        </button>
        <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded-md border-0 cursor-pointer" title="Brush Color" />
        <input type="range" min="1" max="10" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-20" title={`Brush Size: ${brushSize}`} />
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-900 relative" style={{ width: `${panelWidth}%` }}>
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <div className="bg-gray-800 rounded-lg w-full h-full relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 cursor-crosshair`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onContextMenu={(e) => e.preventDefault()}
            style={{ backgroundColor: "#000000", width: "100%", height: "100%" }}
          />

          {Toolbar}

          {!hasDrawn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <PenTool className="w-16 h-16 opacity-20 mb-4 text-white" />
              <p className="text-white text-lg">Start drawing to visualize your solution</p>
              <p className="text-sm text-gray-300 mt-2">Use the tools above to draw diagrams and explain your approach</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
