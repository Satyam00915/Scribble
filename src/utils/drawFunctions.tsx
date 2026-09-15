import type { Ellipse, Rectangle } from "../App";

export const drawRectangle = (
  props: Rectangle,
  ctx: React.RefObject<CanvasRenderingContext2D | null>,
) => {
  if (!ctx.current) return;
  ctx.current.strokeRect(props.x, props.y, props.width, props.height);
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
