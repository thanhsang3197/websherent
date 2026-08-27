import 'server-only';

/**
 * Đọc sản phẩm real-time từ Google Sheets API (chạy PHÍA SERVER — API key không lộ ra client).
 * Dùng chung logic map với mock qua lib/mapping.ts.
 *
 * Yêu cầu Sheet: chia sẻ "Bất kỳ ai có đường liên kết — Người xem" để API key đọc được
 * (API key chỉ đọc sheet công khai). Nếu cần giữ Sheet riêng tư -> chuyển sang service account.
 */

import type { Product } from '../types/product';
import { mapRows } from './mapping';

interface SheetsValuesResponse {
  values?: string[][];
}

/** Có đủ cấu hình để gọi Google Sheets không? Thiếu -> app dùng mock-data. */
export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_API_KEY && process.env.GOOGLE_SHEET_ID,
  );
}

function getRevalidateSeconds(): number {
  const n = Number(process.env.SHEETS_REVALIDATE_SECONDS ?? '21600');
  return Number.isFinite(n) && n >= 0 ? n : 21600;
}

/**
 * Lấy danh sách sản phẩm từ Google Sheet. Ném lỗi nếu thiếu cấu hình hoặc API lỗi
 * (lib/products.ts bắt lỗi và fallback về mock để trang không bao giờ trống).
 */
export async function fetchProductsFromSheet(): Promise<Product[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  // Giới hạn số dòng mặc định (không để mở "A1:L") để tránh đọc luôn hàng chục nghìn
  // dòng template trống mà AppSheet hay sinh ra — payload lớn sẽ vượt trần cache 2MB
  // của Next.js. Set GOOGLE_SHEET_RANGE trong .env để tuỳ chỉnh theo Sheet thật.
  const range = process.env.GOOGLE_SHEET_RANGE ?? 'A1:L1000';

  if (!apiKey || !sheetId) {
    throw new Error('Thiếu GOOGLE_SHEETS_API_KEY hoặc GOOGLE_SHEET_ID.');
  }

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}` +
    `/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    // ISR: cache dữ liệu Sheet, làm mới định kỳ (gần real-time).
    next: { revalidate: getRevalidateSeconds() },
  });

  if (!res.ok) {
    throw new Error(`Google Sheets API lỗi ${res.status}.`);
  }

  const data = (await res.json()) as SheetsValuesResponse;
  return mapRows(data.values ?? [], /* hasHeader */ true);
}
