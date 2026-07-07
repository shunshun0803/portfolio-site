// Shared pixel-art sprites + draw helpers used by the hero canvas and the minigame.

/* Classic 11x8 "invader" sprites (two animation frames) */
export const INVADER_A = [
  '00100000100',
  '00010001000',
  '00111111100',
  '01101110110',
  '11111111111',
  '10111111101',
  '10100000101',
  '00011011000',
];
export const INVADER_B = [
  '00100000100',
  '10010001001',
  '10111111101',
  '11101110111',
  '11111111111',
  '01111111110',
  '00100000100',
  '01000000010',
];

/* 11x8 player fighter / cannon, pointing up */
export const SHIP = [
  '00000100000',
  '00001110000',
  '00011111000',
  '00011111000',
  '01111111110',
  '11111111111',
  '11011111011',
  '10000000001',
];

/** Draw a bitmap sprite with the top-left corner at (ox, oy). */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  px: number,
  ox: number,
  oy: number,
  color: string,
) {
  ctx.fillStyle = color;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '1') ctx.fillRect(ox + c * px, oy + r * px, px, px);
    }
  }
}

/** Draw a bitmap sprite centered on (cx, cy). */
export function drawSpriteCentered(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  px: number,
  cx: number,
  cy: number,
  color: string,
) {
  const w = rows[0].length * px;
  const h = rows.length * px;
  drawSprite(ctx, rows, px, Math.round(cx - w / 2), Math.round(cy - h / 2), color);
}
