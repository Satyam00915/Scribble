import type { Circle, Ellipse, Line, Pencil, Rectangle, Shape, Text } from "./types";

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

export const checkNearLine = (offsetX: number, offsetY: number, s: Line) => {
  const num = Math.abs(
    (s.endY - s.y) * offsetX -
      (s.endX - s.x) * offsetY +
      s.endX * s.y -
      s.endY * s.x,
  );
  const den = Math.sqrt((s.endY - s.y) ** 2 + (s.endX - s.x) ** 2);
  const distance = num / den;
  return distance < 8;
};

export const checkNearText = (
  offsetX: number,
  offsetY: number,
  s: Text,
  ctx: CanvasRenderingContext2D,
) => {
  const height = 28;
  const width = ctx.measureText(s.text).width;
  return (
    offsetX >= s.x &&
    offsetX <= s.x + width &&
    offsetY >= s.y &&
    offsetY <= s.y + height
  );
};

export const checkNearPencil = (
  offsetX: number,
  offsetY: number,
  s: Pencil,
): boolean => {
  const points = s.points;
  if (points.length < 2) return false;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const num = Math.abs(
      (y2 - y1) * offsetX - (x2 - x1) * offsetY + x2 * y1 - y2 * x1,
    );
    const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    if (den === 0) continue;
    const distance = num / den;
    if (
      distance <= 10 &&
      offsetX >= Math.min(x1, x2) - 10 &&
      offsetX <= Math.max(x1, x2) + 10 &&
      offsetY >= Math.min(y1, y2) - 10 &&
      offsetY <= Math.max(y1, y2) + 10
    ) {
      return true;
    }
  }
  return false;
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
  } else if (s.type === "Line") {
    ctx.strokeRect(
      Math.min(s.endX, s.x - 8),
      Math.min(s.endY, s.y - 8),
      Math.abs(s.endX - s.x + 16),
      Math.abs(s.endY - s.y + 16),
    );
  } else if (s.type === "Text") {
    const height = 28;
    const width = ctx.measureText(s.text).width;

    ctx.strokeRect(s.x, s.y, width, height);
  } else if (s.type === "Pencil") {
    const xs = s.points.map((p) => p[0]);
    const ys = s.points.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    ctx.strokeRect(minX - 8, minY - 8, maxX - minX + 16, maxY - minY + 16);
  }

  ctx.restore();
};
