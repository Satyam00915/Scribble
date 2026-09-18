import React, { useEffect, useRef, useState } from "react";
import {
  drawCircle,
  drawEllipse,
  drawLine,
  drawRectangle,
  drawRough,
  drawText,
} from "./utils/drawFunctions";
import {
  checkInsideCircle,
  checkInsideEllipse,
  checkInsideRectangle,
  checkNearLine,
  checkNearPencil,
  checkNearText,
  drawSelectBorder,
} from "./utils/helper";
import type { Shape, Shapes, Text } from "./utils/types";
import rough from "roughjs";
import type { RoughCanvas } from "roughjs/bin/canvas";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const roughRef = useRef<RoughCanvas>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startX = useRef(0);
  const startY = useRef(0);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const isDragging = useRef(false);

  const isDrawing = useRef(false);
  const isShape = useRef<
    "Rectangle" | "Ellipse" | "Circle" | "Line" | "Pencil" | "Text" | "Eraser"
  >("Rectangle");

  const [writing, setWriting] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const [activeTool, setActiveTool] = useState<
    "Select" | "Rectangle" | "Ellipse" | "Circle" | "Line" | "Pencil" | "Text" | "Eraser"
  >("Rectangle");
  const [isSelect, setSelect] = useState(false);
  const isShapeSelect = useRef<boolean>(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const [shapes, setShapes] = useState<Shapes>([]);
  const [redo, setRedo] = useState<Shapes>([]);

  const currentPath = useRef<[x: number, y: number][]>([]);

  const handleBlur = () => {
    if (!writing) return;

    if (writing.text.trim() !== "") {
      const newShape: Text = {
        id: Date.now().toString(),
        type: "Text",
        text: writing.text,
        x: writing.x,
        y: writing.y,
      };

      setShapes((prev) => [...prev, newShape]);
    }

    setWriting(null);
  };

  console.log(shapes);
  function DrawShapes(
    ctx: React.RefObject<CanvasRenderingContext2D | null>,
    roughRef: React.RefObject<RoughCanvas | null>,
  ) {
    shapes.forEach((s) => {
      if (!roughRef.current) return;
      if (!ctx.current) return;
      if (s.type === "Rectangle") {
        drawRectangle(s, roughRef.current);
      } else if (s.type === "Ellipse") {
        drawEllipse(s, roughRef.current);
      } else if (s.type === "Circle") {
        drawCircle(s, roughRef.current);
      } else if (s.type === "Line") {
        drawLine(s, roughRef.current);
      } else if (s.type === "Pencil") {
        drawRough(s, roughRef.current);
      } else if (s.type === "Text") {
        console.log("Drawing..text");
        drawText(s, ctx.current);
      }

      if (s.id === selectedShapeId && isShapeSelect.current) {
        drawSelectBorder(ctx.current, s);
      }
    });
  }

  const eraseAt = (x: number, y: number) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      let hit = false;

      if (s.type === "Rectangle" && checkInsideRectangle(x, y, s)) hit = true;
      else if (s.type === "Circle" && checkInsideCircle(x, y, s)) hit = true;
      else if (s.type === "Ellipse" && checkInsideEllipse(x, y, s)) hit = true;
      else if (s.type === "Line" && checkNearLine(x, y, s)) hit = true;
      else if (
        s.type === "Text" &&
        contextRef.current &&
        checkNearText(x, y, s, contextRef.current)
      )
        hit = true;
      else if (s.type === "Pencil" && checkNearPencil(x, y, s)) hit = true;
      if (hit) {
        setShapes((prev) => prev.filter((item) => item.id !== s.id));
        break;
      }
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    const { offsetX: x, offsetY: y } = e;

    if (isShapeSelect.current) {
      for (let i = shapes.length - 1; i >= 0; i--) {
        const s: Shape = shapes[i];
        if (s.type === "Rectangle") {
          if (checkInsideRectangle(x, y, s)) {
            setSelectedShapeId(s.id);
            dragStartX.current = x;
            dragStartY.current = y;
            isDragging.current = true;
            return;
          }
        } else if (s.type === "Circle") {
          if (checkInsideCircle(x, y, s)) {
            setSelectedShapeId(s.id);
            dragStartX.current = x;
            dragStartY.current = y;
            isDragging.current = true;
            return;
          }
        } else if (s.type === "Ellipse") {
          if (checkInsideEllipse(x, y, s)) {
            setSelectedShapeId(s.id);
            dragStartX.current = x;
            dragStartY.current = y;
            isDragging.current = true;
            return;
          }
        } else if (s.type === "Line") {
          if (checkNearLine(x, y, s)) {
            setSelectedShapeId(s.id);
            dragStartX.current = x;
            dragStartY.current = y;
            isDragging.current = true;
            return;
          }
        } else if (s.type === "Text" && contextRef.current) {
          if (checkNearText(x, y, s, contextRef.current)) {
            setSelectedShapeId(s.id);
            dragStartX.current = x;
            dragStartY.current = y;
            isDragging.current = true;
            return;
          }
        } else if (s.type === "Pencil") {
          if (checkNearPencil(x, y, s)) {
            setSelectedShapeId(s.id);
            dragStartX.current = x;
            dragStartY.current = y;
            isDragging.current = true;
            return;
          }
        }
      }
      setSelectedShapeId(null);

      return;
    }
    if (isShape.current === "Eraser") {
      eraseAt(x, y);
      isDrawing.current = true;
      return;
    }

    if (isShape.current === "Text") {
      const { offsetX: x, offsetY: y } = e;

      if (inputRef.current && inputRef.current.value.trim() !== "") {
        // Commit the previous text!
        const textVal = inputRef.current.value.trim();
        // We get previous coordinates from inputRef's style or from writing state:
        const prevX = parseInt(inputRef.current.style.left) || 0;
        const prevY = parseInt(inputRef.current.style.top) || 0;
        const newShape: Text = {
          id: Date.now().toString(),
          type: "Text",
          text: textVal,
          x: prevX,
          y: prevY,
        };
        setShapes((prev) => [...prev, newShape]);
      }
      setWriting({
        x,
        y,
        text: "",
      });
      return;
    }

    startX.current = x;
    startY.current = y;

    currentPath.current = [];
    currentPath.current.push([x, y]);

    isDrawing.current = true;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (isDragging.current) {
      const { offsetX: x, offsetY: y } = e;
      const deltaX = x - dragStartX.current;
      const deltaY = y - dragStartY.current;

      setShapes((prev) =>
        prev.map((s) => {
          if (s.id === selectedShapeId) {
            if (s.type === "Line") {
              return {
                ...s,
                x: s.x + deltaX,
                y: s.y + deltaY,
                endX: s.endX + deltaX,
                endY: s.endY + deltaY,
              };
            } else if (s.type === "Pencil") {
              return {
                ...s,
                points: s.points.map((s) => [s[0] + deltaX, s[1] + deltaY]),
              };
            } else {
              return { ...s, x: s.x + deltaX, y: s.y + deltaY };
            }
          }
          return s;
        }),
      );

      dragStartX.current = x;
      dragStartY.current = y;

      return;
    }
    if (isShapeSelect.current) return;
    if (!isDrawing.current) return;
    if (!canvasRef.current) return;
    if (!contextRef.current) return;
    if (!roughRef.current) return;

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    DrawShapes(contextRef, roughRef);

    if (isShape.current === "Rectangle") {
      const width = e.offsetX - startX.current;
      const height = e.offsetY - startY.current;

      roughRef.current?.rectangle(
        startX.current,
        startY.current,
        width,
        height,
        {
          stroke: "white",
          roughness: 3.5,
        },
      );
    } else if (isShape.current === "Ellipse") {
      const radiusX = Math.abs(e.offsetX - startX.current) / 2;
      const radiusY = Math.abs(e.offsetY - startY.current) / 2;

      roughRef.current.ellipse(
        Math.min(startX.current + radiusX, e.offsetX + radiusX),
        Math.min(startY.current + radiusY, e.offsetY + radiusY),
        2 * radiusX,
        2 * radiusY,
        {
          stroke: "white",
        },
      );
    } else if (isShape.current === "Circle") {
      const { offsetX, offsetY } = e;
      const dx = offsetX - startX.current;
      const dy = offsetY - startY.current;

      const radius = Math.sqrt(dx * dx + dy * dy);

      roughRef.current.circle(startX.current, startY.current, 2 * radius, {
        stroke: "white",
        roughness: 1.5,
      });
    } else if (isShape.current === "Line") {
      const { offsetX, offsetY } = e;

      roughRef.current.line(startX.current, startY.current, offsetX, offsetY, {
        stroke: "white",
        roughness: 2,
      });
    } else if (isShape.current === "Pencil") {
      const { offsetX: x, offsetY: y } = e;
      currentPath.current.push([x, y]);
      roughRef.current.linearPath(currentPath.current, {
        stroke: "white",
        strokeWidth: 2,
      });
    } else if (isShape.current === "Eraser" && isDrawing.current) {
      const { offsetX: x, offsetY: y } = e;
      eraseAt(x, y);
      return;
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (isShapeSelect.current) {
      isDragging.current = false;
      return;
    }
    isDrawing.current = false;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    const width = currentX - startX.current;
    const height = currentY - startY.current;

    let newShape: Shape;

    if (isShape.current === "Rectangle") {
      newShape = {
        id: Date.now().toString(),
        type: "Rectangle",
        x: startX.current,
        y: startY.current,
        width,
        height,
        radius: 20,
      };
    } else if (isShape.current === "Ellipse") {
      const radiusX = Math.abs(e.offsetX - startX.current) / 2;
      const radiusY = Math.abs(e.offsetY - startY.current) / 2;
      newShape = {
        id: Date.now().toString(),
        type: "Ellipse",
        x: Math.min(startX.current + radiusX, e.offsetX + radiusX),
        y: Math.min(startY.current + radiusY, e.offsetY + radiusY),
        radiusX,
        radiusY,
        rotation: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
      };
    } else if (isShape.current === "Circle") {
      const { offsetX, offsetY } = e;
      const dx = offsetX - startX.current;
      const dy = offsetY - startY.current;

      const radius = Math.sqrt(dx * dx + dy * dy);

      newShape = {
        id: Date.now().toString(),
        type: "Circle",
        x: startX.current,
        y: startY.current,
        radius,
        startAngle: 0,
        endAngle: Math.PI * 2,
      };
    } else if (isShape.current === "Line") {
      const { offsetX, offsetY } = e;

      newShape = {
        id: Date.now().toString(),
        type: "Line",
        x: startX.current,
        y: startY.current,
        endX: offsetX,
        endY: offsetY,
      };
    } else if (isShape.current === "Pencil") {
      newShape = {
        id: Date.now().toString(),
        type: "Pencil",
        points: currentPath.current,
      };
    } else if (isShape.current === "Text") {
      return;
    } else if (isShape.current === "Eraser") {
      return;
    }

    setShapes((prev) => [...prev, newShape]);
    setRedo([]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const rc = rough.canvas(canvasRef.current);
    if (!ctx) return;

    const canvas = canvasRef.current;

    contextRef.current = ctx;
    roughRef.current = rc;

    canvasRef.current.addEventListener("pointerdown", handlePointerDown);
    canvasRef.current.addEventListener("pointermove", handlePointerMove);
    canvasRef.current.addEventListener("pointerup", handlePointerUp);

    ctx.strokeStyle = "white";

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    DrawShapes(contextRef, roughRef);

    return () => {
      if (canvas) {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUp);
      }
    };
  }, [shapes, selectedShapeId]);

  return (
    <div className="relative">
      {/* Real Excalidraw Floating Island Toolbar */}
      <nav
        aria-label="Canvas Toolbar"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 bg-[#121212]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.45)] rounded-2xl select-none"
      >
        {/* Undo / Redo Section */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-white/10">
          <button
            type="button"
            disabled={shapes.length === 0}
            onClick={() => {
              setSelectedShapeId(null);
              const oldShape: Shape = shapes[shapes.length - 1];
              setShapes((prev) => prev.slice(0, -1));
              setWriting(null);
              setRedo((prev) => [...prev, oldShape]);
            }}
            title="Undo (Ctrl+Z)"
            className={`w-9 h-9 rounded-xl transition-all duration-150 flex items-center justify-center relative group ${
              shapes.length > 0
                ? "text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 cursor-pointer"
                : "text-zinc-600 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>

          <button
            type="button"
            disabled={redo.length === 0}
            onClick={() => {
              const oldShape: Shape = redo[redo.length - 1];
              setShapes((prev) => [...prev, oldShape]);
              setWriting(null);
              setRedo((prev) => prev.slice(0, -1));
            }}
            title="Redo (Ctrl+Y)"
            className={`w-9 h-9 rounded-xl transition-all duration-150 flex items-center justify-center relative group ${
              redo.length > 0
                ? "text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 cursor-pointer"
                : "text-zinc-600 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
            </svg>
          </button>
        </div>

        {/* Tools Section */}
        <div className="flex items-center gap-1">
          {/* Select Tool */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Select");
              setSelect(true);
              isShapeSelect.current = true;
              setWriting(null);
            }}
            title="Selection (1)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Select"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">1</span>
          </button>

          {/* Rectangle */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Rectangle");
              isShape.current = "Rectangle";
              setSelect(false);
              isShapeSelect.current = false;
              setWriting(null);
            }}
            title="Rectangle (2)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Rectangle"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">2</span>
          </button>

          {/* Circle */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Circle");
              isShape.current = "Circle";
              setSelect(false);
              setWriting(null);
              isShapeSelect.current = false;
            }}
            title="Circle (3)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Circle"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">3</span>
          </button>

          {/* Ellipse */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Ellipse");
              isShape.current = "Ellipse";
              setSelect(false);
              setWriting(null);
              isShapeSelect.current = false;
            }}
            title="Ellipse (4)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Ellipse"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="10" ry="6" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">4</span>
          </button>

          {/* Line */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Line");
              isShape.current = "Line";
              setSelect(false);
              setWriting(null);
              isShapeSelect.current = false;
            }}
            title="Line (5)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Line"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="19" x2="19" y2="5" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">5</span>
          </button>

          {/* Pencil */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Pencil");
              isShape.current = "Pencil";
              setSelect(false);
              setWriting(null);
              isShapeSelect.current = false;
            }}
            title="Pencil / Draw (6)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Pencil"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">6</span>
          </button>

          {/* Text */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Text");
              isShape.current = "Text";
              setSelect(false);
              isShapeSelect.current = false;
            }}
            title="Text (7)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Text"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">7</span>
          </button>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("Eraser");
              isShape.current = "Eraser";
              setSelect(false);
              isShapeSelect.current = false;
            }}
            title="Eraser (0)"
            className={`w-10 h-10 rounded-xl transition-all duration-150 flex items-center justify-center relative group cursor-pointer active:scale-95 ${
              activeTool === "Eraser"
                ? "bg-[#6965db] text-white shadow-lg shadow-[#6965db]/40"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
              <path d="M22 21H7" />
              <path d="m5 11 9 9" />
            </svg>
            <span className="absolute -bottom-0.5 right-1 text-[9px] font-medium opacity-40 group-hover:opacity-70">0</span>
          </button>
        </div>
      </nav>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block bg-[#000000]"
      />
      {writing && (
        <>
          <input
            ref={inputRef}
            autoFocus
            value={writing.text}
            onChange={(e) =>
              setWriting((prev) =>
                prev ? { ...prev, text: e.target.value } : null,
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBlur();
              }
            }}
            style={{
              left: writing.x,
              top: writing.y,
              fontFamily: "Caveat",
            }}
            className="absolute bg-transparent text-white border border-dashed border-[#666] outline-0 text-[28px]"
          />
        </>
      )}
    </div>
  );
}

export default App;
