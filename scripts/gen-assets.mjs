// Generates the brand's static image assets into public/ from the hallmark seal.
// Run: node scripts/gen-assets.mjs
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const GOLD = '#c79a3d';
const BG = '#15140f';
const INK = '#f4efe4';
const DIM = '#b9b2a1';

const seal = (size, stroke = GOLD, sw = [1.4, 1, 1.6]) => `
  <g transform="scale(${size / 48})" fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="21" stroke-width="${sw[0]}"/>
    <circle cx="24" cy="24" r="15.5" stroke-width="${sw[1]}"/>
    <path d="M17 24.5L21.5 29L31.5 18" stroke-width="${sw[2]}"/>
  </g>`;

const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const iconSvg = (size, pad = 0.12) => {
  const inner = size * (1 - pad * 2);
  return svgDoc(size, size,
    `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${BG}"/>
     <g transform="translate(${size * pad} ${size * pad})">${seal(inner, GOLD, [2, 1.4, 2.4])}</g>`);
};

// Open Graph card 1200x630
const og = svgDoc(1200, 630, `
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="0" y="0" width="1200" height="6" fill="${GOLD}"/>
  <g transform="translate(88 96)">${seal(88, GOLD, [1.2, 0.8, 1.4])}</g>
  <text x="88" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="${INK}">Strategic recruiting for the</text>
  <text x="88" y="345" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="${INK}">financial services industry.</text>
  <text x="88" y="430" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${DIM}">Experienced advisors · Advisor support · Sales · Executive search</text>
  <text x="88" y="540" font-family="Georgia, serif" font-size="34" fill="${GOLD}">Golden Recruiting</text>
  <text x="1112" y="540" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="${DIM}">Charlotte, NC</text>
`);

await mkdir('public', { recursive: true });
await sharp(Buffer.from(og)).png().toFile('public/og.png');
await sharp(Buffer.from(iconSvg(512))).png().toFile('public/logo.png');
await sharp(Buffer.from(iconSvg(512))).png().toFile('public/icon-512.png');
await sharp(Buffer.from(iconSvg(192))).png().toFile('public/icon-192.png');
await sharp(Buffer.from(iconSvg(180))).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(iconSvg(32, 0.08))).png().toFile('public/favicon-32.png');
// .ico: a 32px PNG stored in an ICO container
const png32 = await sharp(Buffer.from(iconSvg(32, 0.08))).png().toBuffer();
const ico = Buffer.alloc(6 + 16);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png32.length, 14); ico.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([ico, png32]));
await writeFile('public/favicon.svg', iconSvg(48, 0.08));
console.log('assets written');
