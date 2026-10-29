export type Shape = Rectangle | Ellipse | Circle | Line | Pencil | Text;

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

export type Line = {
  id: string;
  type: "Line";
  x: number;
  y: number;
  endX: number;
  endY: number;
};

export type Pencil = {
  id: string;
  type: "Pencil";
  points: [x: number, y: number][];
};

export type Text = {
  id: string;
  type: "Text";
  text: string;
  x: number;
  y: number;
};

export type Shapes = Shape[];
