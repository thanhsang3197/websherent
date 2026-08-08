/**
 * Sinh lib/mock-data.ts từ file CSV export của Google Sheet.
 *
 * Chạy:  npm run generate:mock   (dùng tsx)
 *
 * Vì sao có script này: khi CHƯA cấu hình Google Sheets API, site chạy bằng
 * lib/mock-data.ts. Script đọc CSV, dùng CHUNG logic map (lib/mapping.ts) với
 * runtime để mock == dữ liệu Sheet thật. Chạy lại mỗi khi CSV thay đổi.
 *
 * // TODO(dữ liệu thật): khi đã có Google Sheets API key, site tự chuyển sang
 * // lib/sheets.ts; file mock chỉ còn là fallback.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapRows, sortProductsForDisplay } from '../lib/mapping';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(scriptDir, '..', 'data', 'App QL TĐ - Sản Phẩm.csv');
const OUT_PATH = join(scriptDir, '..', 'lib', 'mock-data.ts');

/** Bỏ BOM (U+FEFF) ở đầu file nếu có. */
function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/** Parser CSV nhỏ gọn: xử lý field trong ngoặc kép, dấu "" escaped, CRLF. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function main(): void {
  const raw = stripBom(readFileSync(CSV_PATH, 'utf8'));
  const rows = parseCsv(raw);
  const products = sortProductsForDisplay(mapRows(rows, /* hasHeader */ true));

  const withImage = products.filter((p) => p.image).length;

  const banner = [
    '// ⚠️ FILE TỰ ĐỘNG SINH — KHÔNG SỬA TAY.',
    '// Nguồn: data/App QL TĐ - Sản Phẩm.csv  |  Sinh lại: npm run generate:mock',
    `// Tổng ${products.length} sản phẩm (${withImage} có ảnh). Fallback khi chưa có Google Sheets API.`,
    "import type { Product } from '../types/product';",
    '',
    `export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};`,
    '',
  ].join('\n');

  writeFileSync(OUT_PATH, banner, 'utf8');
  console.log(
    `✓ Đã sinh lib/mock-data.ts: ${products.length} sản phẩm (${withImage} có ảnh).`,
  );
}

main();
