import type { Circle, Ellipse, Rectangle } from "../App";

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
