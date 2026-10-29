import type { RoughCanvas } from "roughjs/bin/canvas";
import type {
  Circle,
  Ellipse,
  Line,
  Pencil,
  Rectangle,
  Text,
} from "./types.ts";

export const drawRectangle = (props: Rectangle, rc: RoughCanvas) => {
  rc.rectangle(props.x, props.y, props.width, props.height, {
    stroke: "white",
    roughness: 2.8,
  });
};

export const drawEllipse = (props: Ellipse, rc: RoughCanvas) => {
  rc.ellipse(props.x, props.y, 2 * props.radiusX, 2 * props.radiusY, {
    stroke: "white",
    roughness: 2,
  });
};

export const drawCircle = (props: Circle, rc: RoughCanvas) => {
  rc.circle(props.x, props.y, 2 * props.radius, {
    stroke: "white",
    roughness: 0.5,
  });
};

export const drawLine = (props: Line, rc: RoughCanvas) => {
  rc.line(props.x, props.y, props.endX, props.endY, {
    stroke: "white",
    roughness: 1.5,
  });
};

export const drawRough = (props: Pencil, rc: RoughCanvas) => [
  rc.linearPath(props.points, {
    stroke: "white",
  }),
];

export const drawText = (props: Text, ctx: CanvasRenderingContext2D) => {
  if (!ctx) return;
  ctx.font = '28px "Caveat"';
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";
  ctx.fillText(props.text, props.x, props.y);
};
