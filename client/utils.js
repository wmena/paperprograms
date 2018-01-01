import Matrix from 'node-matrices';

export function norm(vector) {
  if (vector.x !== undefined) return norm([vector.x, vector.y]);
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

export function add(v1, v2) {
  if (v1.x !== undefined) return { x: v1.x + v2.x, y: v1.y + v2.y };
  return v1.map((value, index) => value + v2[index]);
}

export function diff(v1, v2) {
  if (v1.x !== undefined) return { x: v1.x - v2.x, y: v1.y - v2.y };
  return v1.map((value, index) => value - v2[index]);
}

export function mult(v1, v2) {
  if (v1.x !== undefined) return { x: v1.x * v2.x, y: v1.y * v2.y };
  return v1.map((value, index) => value * v2[index]);
}

export function div(v1, v2) {
  if (v1.x !== undefined) return { x: v1.x / v2.x, y: v1.y / v2.y };
  return v1.map((value, index) => value / v2[index]);
}

export function cross(v1, v2) {
  if (v1.x === undefined || v2.x === undefined) throw new Error('Must be points');
  return v1.x * v2.y - v1.y * v2.x;
}

export function clip(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Per http://graphics.cs.cmu.edu/courses/15-463/2008_fall/Papers/proj.pdf
export function forwardProjectionMatrixForPoints(points) {
  const deltaX1 = points[1].x - points[2].x;
  const deltaX2 = points[3].x - points[2].x;
  const sumX = points[0].x - points[1].x + points[2].x - points[3].x;
  const deltaY1 = points[1].y - points[2].y;
  const deltaY2 = points[3].y - points[2].y;
  const sumY = points[0].y - points[1].y + points[2].y - points[3].y;
  const denominator = new Matrix([deltaX1, deltaX2], [deltaY1, deltaY2]).determinant();
  const g = new Matrix([sumX, deltaX2], [sumY, deltaY2]).determinant() / denominator;
  const h = new Matrix([deltaX1, sumX], [deltaY1, sumY]).determinant() / denominator;
  const a = points[1].x - points[0].x + g * points[1].x;
  const b = points[3].x - points[0].x + h * points[3].x;
  const c = points[0].x;
  const d = points[1].y - points[0].y + g * points[1].y;
  const e = points[3].y - points[0].y + h * points[3].y;
  const f = points[0].y;
  return new Matrix([a, b, c], [d, e, f], [g, h, 1]);
}

export function projectPoint(point, projectionMatrix) {
  const pointMatrix = projectionMatrix.multiply(new Matrix([point.x], [point.y], [1]));
  return {
    x: pointMatrix.get(0, 0) / pointMatrix.get(2, 0),
    y: pointMatrix.get(1, 0) / pointMatrix.get(2, 0),
  };
}