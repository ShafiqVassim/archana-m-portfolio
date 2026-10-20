// Shared lavender-sprig geometry (90×230), used by Sprig and Bouquet.
const r = (n: number) => Math.round(n * 100) / 100;
const deg = (rad: number) => r((rad * 180) / Math.PI);
type E = { cx: number; cy: number; rx: number; ry: number; rot: number; fill: string; stroke?: string };
const buds: E[] = [];
for (let i = 0; i < 8; i++) {
  const y = 36 + i * 13;
  const fill = i % 2 ? '#9B86CF' : '#B9A6E0';
  buds.push({ cx: 38, cy: y, rx: 8.5, ry: 4.5, rot: deg(-2.2), fill, stroke: '#7E6AAE' });
  buds.push({ cx: 52, cy: y + 5, rx: 8.5, ry: 4.5, rot: deg(-0.9), fill, stroke: '#7E6AAE' });
}
buds.push({ cx: 45, cy: 26, rx: 8, ry: 4.5, rot: -90, fill: '#B9A6E0', stroke: '#7E6AAE' });
export const sprigLeaves: E[] = [
  { cx: 32, cy: 205, rx: 13, ry: 4.5, rot: deg(-2.4), fill: '#7C8C45' },
  { cx: 58, cy: 195, rx: 13, ry: 4.5, rot: deg(-0.7), fill: '#7C8C45' },
];
export const sprigBuds = buds;
export const sprigStem = 'M45 225 C40 170 50 100 45 30';
