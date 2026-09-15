import { useEffect, useRef, useState } from "react";
import { drawCircle, drawEllipse, drawRectangle } from "./utils/drawFunctions";

type Shape = Rectangle | Ellipse | Circle;

export type Rectangle = {
  type: "Rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

export type Circle = {
  type: "Circle";
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
};

export type Ellipse = {
  type: "Ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
};

type Shapes = Shape[];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);

  const startX = useRef(0);
  const startY = useRef(0);

  const isDrawing = useRef(false);
  const isShape = useRef<"Rectangle" | "Ellipse" | "Circle">("Rectangle");

  const [shapes, setShapes] = useState<Shapes>([]);
  const [redo, setRedo] = useState<Shapes>([]);
  function DrawShapes(ctx: React.RefObject<CanvasRenderingContext2D | null>) {
    shapes.forEach((s) => {
      if (s.type === "Rectangle") {
        drawRectangle(s, ctx);
      } else if (s.type === "Ellipse") {
        drawEllipse(s, ctx);
      } else if (s.type === "Circle") {
        drawCircle(s, ctx);
      }
    });
  }

  const handlePointerDown = (e: PointerEvent) => {
    const { offsetX: x, offsetY: y } = e;

    startX.current = x;
    startY.current = y;

    isDrawing.current = true;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDrawing.current) return;
    if (!canvasRef.current) return;
    if (!contextRef.current) return;

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    DrawShapes(contextRef);

    if (isShape.current === "Rectangle") {
      const width = e.offsetX - startX.current;
      const height = e.offsetY - startY.current;

      contextRef.current.beginPath();
      contextRef.current?.roundRect(
        startX.current,
        startY.current,
        width,
        height,
        20,
      );
      contextRef.current.stroke();
    } else if (isShape.current === "Ellipse") {
      const radiusX = Math.abs(e.offsetX - startX.current) / 2;
      const radiusY = Math.abs(e.offsetY - startY.current) / 2;

      contextRef.current.beginPath();
      contextRef.current.ellipse(
        Math.min(startX.current + radiusX, e.offsetX + radiusX),
        Math.min(startY.current + radiusY, e.offsetY + radiusY),
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2,
      );
      contextRef.current.stroke();
    } else if (isShape.current === "Circle") {
      const { offsetX, offsetY } = e;
      const dx = offsetX - startX.current;
      const dy = offsetY - startY.current;

      const radius = Math.sqrt(dx * dx + dy * dy);

      contextRef.current.beginPath();
      contextRef.current.arc(
        startX.current,
        startY.current,
        radius,
        0,
        Math.PI * 2,
      );
      contextRef.current.stroke();
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    isDrawing.current = false;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    const width = currentX - startX.current;
    const height = currentY - startY.current;

    let newShape: Shape;

    if (isShape.current === "Rectangle") {
      newShape = {
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
        type: "Circle",
        x: startX.current,
        y: startY.current,
        radius,
        startAngle: 0,
        endAngle: Math.PI * 2,
      };
    }
    setShapes((prev) => [...prev, newShape]);
    setRedo([]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    contextRef.current = ctx;

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
    DrawShapes(contextRef);

    return () => {
      canvasRef.current?.removeEventListener("pointerdown", handlePointerDown);
      canvasRef.current?.removeEventListener("pointermove", handlePointerMove);
      canvasRef.current?.removeEventListener("pointerup", handlePointerUp);
    };
  }, [shapes]);

  return (
    <div className="relative">
      <div className="absolute flex justify-center items-center w-full gap-10">
        <button
          onClick={() => {
            isShape.current = "Rectangle";
          }}
          className="bg-gray-500 text-white"
        >
          Rectangle
        </button>
        <button
          onClick={() => {
            isShape.current = "Ellipse";
          }}
          className="bg-gray-500 text-white"
        >
          Ellipse
        </button>
        <button
          onClick={() => {
            isShape.current = "Circle";
          }}
          className="bg-gray-500 text-white"
        >
          Circle
        </button>
        <button
          disabled={shapes.length === 0}
          onClick={() => {
            const oldShape: Shape = shapes[shapes.length - 1];
            setShapes((prev) => prev.slice(0, -1));
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
            setRedo((prev) => prev.slice(0, -1));
          }}
          className="bg-gray-500 text-white"
        >
          Redo
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block bg-[#000000]"
      />
    </div>
  );
}

export default App;
