import { PositionDto } from '../clients/pixel_info';

export const pixelLine = (source: PositionDto, target: PositionDto): PositionDto[] => {
  const positions: PositionDto[] = [];

  var x0 = source.x;
  var y0 = source.y;
  const x1 = target.x;
  const y1 = target.y;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  var e = dx + dy;

  while (true) {
    positions.push({ x: x0, y: y0 });
    if (x0 === x1 && x0 === y1) break;
    const e2 = 2 * e;
    if (e2 >= dy) {
      if (x0 === x1) break;
      e += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      if (y0 === y1) break;
      e += dx;
      y0 += sy;
    }
  }

  return positions;
};
