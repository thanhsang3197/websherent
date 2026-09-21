/**
 * Sinh icon PNG cho màn hình chính điện thoại: `npm run generate:icons`.
 *
 * Chỉ chạy tay khi đổi nhận diện — ảnh sinh ra được commit vào `public/`, build
 * trên Vercel không gọi script này.
 *
 * Vì sao chỉ có chữ "S" mà không kèm "SHERENT / CLOTHING RENTAL" như favicon
 * (app/icon.svg): ở cỡ 180px trên màn hình chính, dòng "CLOTHING RENTAL" cao
 * chưa tới 10px — không đọc ra chữ, chỉ thành một vệt xám làm bẩn ô icon.
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

/**
 * Ô đen full-bleed + chữ S trắng căn giữa.
 *
 * KHÔNG bo góc: cả iOS lẫn Android đều tự khoét icon theo khuôn của máy. Bo
 * sẵn thì bốn góc trong suốt bị nền hệ thống ăn vào, nhìn như icon lỗi.
 *
 * `ratio` = cỡ chữ / cạnh ô. `dy` 0.36em kéo chữ xuống cho quang tâm rơi đúng
 * giữa ô (căn theo baseline thì chữ trông như bị đội lên trên).
 */
function svg(size, ratio) {
  const fontSize = Math.round(size * ratio);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="${size / 2}" y="${size / 2}" dy="0.36em" font-family="Playfair Display, Georgia, Times New Roman, serif" font-size="${fontSize}" font-weight="600" fill="#FFFFFF" text-anchor="middle">S</text>
</svg>`;
}

const JOBS = [
  // iOS: đúng một cỡ 180×180, Safari không cần bản nào khác.
  ['apple-touch-icon.png', 180, 0.62],
  // Android/Chrome đọc từ manifest (app/manifest.ts).
  ['icon-192.png', 192, 0.62],
  ['icon-512.png', 512, 0.62],
  // Bản bị khoét theo khuôn máy: chữ nhỏ lại để nằm trong vùng an toàn 80%.
  ['icon-512-maskable.png', 512, 0.42],
];

for (const [name, size, ratio] of JOBS) {
  const buf = await sharp(Buffer.from(svg(size, ratio))).png().toBuffer();
  writeFileSync(join(OUT_DIR, name), buf);
  console.log(`${name} — ${size}×${size}, ${(buf.length / 1024).toFixed(1)} KB`);
}
