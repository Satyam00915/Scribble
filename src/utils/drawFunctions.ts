import type { Circle, Ellipse, Line, Rectangle } from "./types.ts";

export const drawRectangle = (
  props: Rectangle,
  ctx: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  if (!ctx.current) return;
  ctx.current.beginPath();
  ctx.current.roundRect(props.x, props.y, props.width, props.height, 20);
  ctx.current.stroke();
};

export const drawEllipse = (
  props: Ellipse,
  ctx: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  if (!ctx.current) return;
  ctx.current.beginPath();
  ctx.current.ellipse(
    props.x,
    props.y,
    props.radiusX,
    props.radiusY,
    props.rotation,
    props.startAngle,
    props.endAngle,
  );
  ctx.current.stroke();
};

export const drawCircle = (
  props: Circle,
  ctx: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  if (!ctx.current) return;
  ctx.current.beginPath();
  ctx.current.arc(
    props.x,
    props.y,
    props.radius,
    props.startAngle,
    props.endAngle,
  );
  ctx.current.stroke();
};

export const drawLine = (
  props: Line,
  ctx: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  ctx.current?.beginPath();
  ctx.current?.moveTo(props.x, props.y);
  ctx.current?.lineTo(props.endX, props.endY);
  ctx.current?.stroke();
};
