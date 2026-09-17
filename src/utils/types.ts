export type Shape = Rectangle | Ellipse | Circle;

export type Rectangle = {
  id: string;
  type: "Rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

export type Circle = {
  id: string;
  type: "Circle";
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
};

export type Ellipse = {
  id: string;
  type: "Ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  startAngle: number;
  endAngle: number;
};

export type Shapes = Shape[];
