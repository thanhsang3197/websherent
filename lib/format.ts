/**
 * Hàm format thuần (không phụ thuộc Next) — dùng chung cho cả app runtime
 * lẫn script sinh mock (scripts/generate-mock.ts qua tsx).
 */

/**
 * Parse chuỗi tiền kiểu Việt Nam "100.000 đ" / "1.620.000 đ" -> số 100000 / 1620000.
 * Dấu "." là phân cách hàng nghìn. Trả 0 nếu rỗng/không hợp lệ.
 */
export function parseVnd(raw: string | null | undefined): number {
  if (!raw) return 0;
  // Giữ lại chữ số, bỏ mọi ký tự khác (dấu chấm nghìn, " đ", khoảng trắng...).
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Format số VND -> "100.000₫" (dấu chấm phân cách nghìn, ký hiệu ₫).
 */
export function formatVnd(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return 'Liên hệ';
  return `${value.toLocaleString('vi-VN')}₫`;
}

/**
 * Format số VND kiểu chủ shop vẫn viết cho khách: "200.000đ" (chữ "đ" thường,
 * không phải ký hiệu ₫). Chỉ dùng ở phần thanh lý — chỗ khác vẫn `formatVnd`.
 */
export function formatVndD(value: number): string {
  return `${value.toLocaleString('vi-VN')}đ`;
}

/**
 * CÂU GIÁ CHUẨN của một mẫu đang pass:
 *
 *   "Pass 200.000đ thuê 300.000đ/3 ngày."
 *
 * Chủ shop chốt 13/08/2026 cách ghi này và muốn MỌI chỗ ghi giống hệt nhau,
 * nên câu chữ nằm ở đây chứ không rải trong component: thẻ ở trang thanh lý và
 * khung trên trang chi tiết sản phẩm cùng gọi một hàm.
 *
 * Hai trường hợp thiếu số vẫn phải ra câu đọc được:
 *  - chưa chốt giá bán  -> "Pass giá liên hệ, thuê 300.000đ/3 ngày."
 *  - không có giá thuê  -> "Pass 200.000đ."
 */
export function saleLine(salePrice: number, rentPrice: number): string {
  const pass = salePrice > 0 ? `Pass ${formatVndD(salePrice)}` : 'Pass giá liên hệ';
  if (!(rentPrice > 0)) return `${pass}.`;
  const thue = `thuê ${formatVndD(rentPrice)}/3 ngày`;
  // Có giá thì hai vế nối thẳng ("Pass 200.000đ thuê 300.000đ/3 ngày."); chưa
  // có giá thì phải thêm dấu phẩy, không thì đọc dính vào nhau.
  return salePrice > 0 ? `${pass} ${thue}.` : `${pass}, ${thue}.`;
}

/** Dòng tình trạng mẫu, luôn cùng một khuôn: "Tình trạng : 99%". */
export function saleNoteLine(note: string): string {
  return `Tình trạng : ${note.trim()}`;
}

/**
 * Chuẩn hoá URL ảnh về CDN raw.githubusercontent.com (tải nhanh, không redirect).
 * Nhận dạng cả:
 *   https://github.com/<user>/<repo>/blob/main/<file>.jpg?raw=true
 *   https://raw.githubusercontent.com/<user>/<repo>/main/<file>.jpg
 * Trả null nếu rỗng/không phải URL hợp lệ.
 */
export function normalizeImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = raw.trim();
  if (!url) return null;

  // github.com/<user>/<repo>/blob/<branch>/<path>?raw=true -> raw.githubusercontent.com
  const blobMatch = url.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^?]+)/i,
  );
  if (blobMatch) {
    const [, user, repo, rest] = blobMatch;
    return `https://raw.githubusercontent.com/${user}/${repo}/${rest}`;
  }

  // Đã là raw hoặc URL https khác -> giữ nguyên.
  if (/^https?:\/\//i.test(url)) return url;

  return null;
}

/**
 * Placeholder SVG mờ mịn kiểu Liquid Glass (warm cream/terracotta backdrop)
 * dùng cho blurDataURL trong next/image.
 */
export const GLASS_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA0MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIGZpbGw9IiNGQ0ZBRjYiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjMwIiByPSIyNSIgZmlsbD0iI0IxNkE0RiIgZmlsbC1vcGFjaXR5PSIwLjEyIiBmaWx0ZXI9InVybCgjYmx1cikiLz48ZGVmcz48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI2Ii8+PC9maWx0ZXI+PC9kZWZzPjwvc3ZnPg==';

/**
 * Tách nhiều link ảnh trong 1 ô (cột "Ảnh phụ") thành mảng URL đã chuẩn hoá.
 * Ngăn cách bằng xuống dòng, dấu phẩy, chấm phẩy hoặc gạch đứng.
 */
export function parseImageList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n\r,;|]+/)
    .map((part) => normalizeImageUrl(part))
    .filter((u): u is string => Boolean(u));
}
