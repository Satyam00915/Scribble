import type { Circle, Ellipse, Rectangle, Shape } from "./types";

export const checkInsideRectangle = (
  offsetX: number,
  offsetY: number,
  s: Rectangle,
) => {
  return (
    offsetX >= Math.min(s.x, s.x + s.width) &&
    offsetX <= Math.max(s.x + s.width, s.x) &&
    offsetY >= Math.min(s.y, s.y + s.height) &&
    offsetY <= Math.max(s.y + s.height, s.y)
  );
};

export const checkInsideCircle = (
  offsetX: number,
  offsetY: number,
  s: Circle,
) => {
  const { radius, x: cx, y: cy } = s;
  const dx = offsetX - cx;
  const dy = offsetY - cy;

  const ans = Math.sqrt(dx * dx + dy * dy) / radius;
  if (ans <= 1) {
    return true;
  } else {
    return false;
  }
};

export const checkInsideEllipse = (
  offsetX: number,
  offsetY: number,
  s: Ellipse,
) => {
  const dx = offsetX - s.x;
  const dy = offsetY - s.y;

  const ans =
    (dx * dx) / (s.radiusX * s.radiusX) + (dy * dy) / (s.radiusY * s.radiusY);

  if (ans <= 1) {
    return true;
  } else {
    return false;
  }
};

export const drawSelectBorder = (ctx: CanvasRenderingContext2D, s: Shape) => {
  if (!ctx) return;
  ctx.save();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 10]);

  if (s.type === "Rectangle") {
    ctx.strokeRect(
      Math.min(s.x, s.x + s.width) - 8,
      Math.min(s.y, s.y + s.height) - 8,
      Math.abs(s.width) + 16,
      Math.abs(s.height) + 16,
    );
  } else if (s.type === "Circle") {
    ctx.strokeRect(
      s.x - s.radius - 8,
      s.y - s.radius - 8,
      2 * s.radius + 16,
      2 * s.radius + 16,
    );
  } else if (s.type === "Ellipse") {
    ctx.strokeRect(
      s.x - s.radiusX - 8,
      s.y - s.radiusY - 8,
      2 * s.radiusX + 16,
      2 * s.radiusY + 16,
    );
  }

  ctx.restore();
};
