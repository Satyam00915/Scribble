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
    "Rectangle" | "Ellipse" | "Circle" | "Line" | "Pencil" | "Text"
  >("Rectangle");

  const [writing, setWriting] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

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
        }
      }
      setSelectedShapeId(null);

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
              return s;
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
      <div className="absolute flex justify-center items-center w-full gap-10">
        <button
          onClick={() => {
            isShape.current = "Rectangle";
            setSelect(false);
            isShapeSelect.current = false;
            setWriting(null);
          }}
          className="bg-gray-500 text-white"
        >
          Rectangle
        </button>
        <button
          onClick={() => {
            isShape.current = "Ellipse";
            setSelect(false);
            setWriting(null);
            isShapeSelect.current = false;
          }}
          className="bg-gray-500 text-white"
        >
          Ellipse
        </button>
        <button
          onClick={() => {
            isShape.current = "Circle";
            setSelect(false);
            setWriting(null);
            isShapeSelect.current = false;
          }}
          className="bg-gray-500 text-white"
        >
          Circle
        </button>
        <button
          onClick={() => {
            isShape.current = "Line";
            setSelect(false);
            setWriting(null);
            isShapeSelect.current = false;
          }}
          className="bg-gray-500 text-white"
        >
          Line
        </button>
        <button
          onClick={() => {
            isShape.current = "Pencil";
            setSelect(false);
            setWriting(null);
            isShapeSelect.current = false;
          }}
          className="bg-gray-500 text-white"
        >
          Pencil
        </button>
        <button
          onClick={() => {
            isShape.current = "Text";
            setSelect(false);
            isShapeSelect.current = false;
          }}
          className="bg-gray-500 text-white"
        >
          Text
        </button>
        <button
          disabled={shapes.length === 0}
          onClick={() => {
            setSelectedShapeId(null);
            const oldShape: Shape = shapes[shapes.length - 1];
            setShapes((prev) => prev.slice(0, -1));
            setWriting(null);
            setRedo((prev) => [...prev, oldShape]);
          }}
          className="bg-gray-500 text-white"
        >
          Undo
        </button>
        <button
          disabled={redo.length === 0}
          onClick={() => {
            const oldShape: Shape = redo[redo.length - 1];
            setShapes((prev) => [...prev, oldShape]);
            setWriting(null);
            setRedo((prev) => prev.slice(0, -1));
          }}
          className="bg-gray-500 text-white"
        >
          Redo
        </button>
        <button
          onClick={() => {
            setSelect(true);
            isShapeSelect.current = true;
            setWriting(null);
          }}
          className={`${isSelect ? "bg-green-500" : "bg-gray-500"} text-white`}
        >
          Select
        </button>
      </div>
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
