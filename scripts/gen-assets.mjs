// Generate website and email assets from the supplied vector identity.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
const BLUE = '#073F8B';
const logo = await readFile('public/brand/logo.svg');
const mark = await readFile('public/brand/Favicon_Favicon_1024_X_1024.svg');
const icon = async (size) => {
  const foreground = await sharp(mark).trim().resize(Math.round(size * .72), Math.round(size * .72), { fit: 'inside' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BLUE } }).composite([{ input: foreground, gravity: 'centre' }]).png().toBuffer();
};
for (const [file, size] of [['icon-512.png',512],['icon-192.png',192],['apple-touch-icon.png',180],['favicon-32.png',32]]) await writeFile(`public/${file}`,await icon(size));
await sharp(logo).resize(1020).png().toFile('public/logo.png');
// Visible on both light and dark browser tab bars.
const favicon = (await readFile('public/brand/Favicon_Favicon_32_X_32.svg','utf8')).replace(/(<svg[^>]*>)/, '$1<rect width="32" height="32" rx="4" fill="#073F8B"/>');
await writeFile('public/favicon.svg',favicon);
const png32 = await icon(32);
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1,2); ico.writeUInt16LE(1,4); ico.writeUInt8(32,6); ico.writeUInt8(32,7);
ico.writeUInt16LE(1,10); ico.writeUInt16LE(32,12); ico.writeUInt32LE(png32.length,14); ico.writeUInt32LE(22,18);
await writeFile('public/favicon.ico',Buffer.concat([ico,png32]));
const wordmark = await sharp(logo).resize(800).png().toBuffer();
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="330" width="1040" height="3" fill="#3FA8E0"/><text x="80" y="418" fill="white" font-size="36" font-family="Arial, sans-serif">Building connections that lead to better hires.</text><text x="80" y="500" fill="white" font-size="24" font-family="Arial, sans-serif">Financial services recruiting · Charlotte, NC</text></svg>`);
await sharp({create:{width:1200,height:630,channels:4,background:BLUE}}).composite([{input:wordmark,left:70,top:80},{input:text}]).png().toFile('public/og.png');
console.log('Brand assets generated');
