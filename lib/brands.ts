/**
 * Chuẩn hoá brand / size / phân loại — thuần, dùng chung app + script mock.
 * Dữ liệu Sheet có nhiều biến thể gõ sai (khảo sát từ CSV), cần gộp về 1 tên chuẩn.
 */

import type { ProductCategory } from '../types/product';
import { slugify } from './slug';

/** Khoá chuẩn hoá để tra bảng alias: bỏ dấu, thường hoá, chỉ giữ a-z0-9. */
function aliasKey(raw: string): string {
  return slugify(raw).replace(/-/g, '');
}

/**
 * Bảng gộp brand: khoá (đã chuẩn hoá) -> tên hiển thị chuẩn.
 * Chỉ liệt kê các brand cần gộp biến thể/gõ sai; brand khác giữ nguyên bản gốc.
 */
const BRAND_ALIASES: Record<string, string> = {
  thosestudios: 'Those Studios',
  thosestudio: 'Those Studios',
  jolieloft: 'Jolie Loft',
  tiinstore: 'Tiinstore',
  hiuroom: 'H.I.U Room',
  hivroom: 'H.I.U Room',
  tranali: 'Trân Ali',
  onomade: 'Onomade',
  ononmade: 'Onomade',
  luciana: 'Luciana',
  luciama: 'Luciana',
  amelie: 'Amelie',
  ameliee: 'Amelie',
  lseoul: 'LSeoul',
  lsoul: 'LSeoul',
  sovintage: 'Sò Vintage',
  havana: 'Havana',
  wonderhouse: 'Wonderhouse',
  dressesinsilk: 'Dressesinsilk',
};

/**
 * Chuẩn hoá brand. Trả null nếu Sheet để trống.
 * Nếu khớp bảng alias -> tên chuẩn; nếu không -> bản gốc đã trim & gộp khoảng trắng.
 */
export function normalizeBrand(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  if (!cleaned) return null;
  const canonical = BRAND_ALIASES[aliasKey(cleaned)];
  return canonical ?? cleaned;
}

/**
 * Chuẩn hoá size về nhóm chuẩn S / M / L / XL / XS / Freesize dựa trên token đầu.
 * Free-text kiểu "M fit S" -> "M"; "Xs fit S" -> "XS". Không khớp -> giữ bản gốc.
 */
export function normalizeSize(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  if (!cleaned) return null;
  const lower = cleaned.toLowerCase();
  if (lower.includes('free')) return 'Freesize';
  const match = lower.match(/^(xs|xl|s|m|l)\b/);
  if (match) return match[1].toUpperCase();
  return cleaned;
}

/**
 * Suy ra phân loại: đầm/váy (tiệc), áo dài, pháp phục hay gấm.
 * Ưu tiên mã SP theo quy ước của tiệm (đáng tin nhất): "AD" = áo dài,
 * "PP" = pháp phục, "G" = gấm. Không khớp mã -> dò tín hiệu "áo dài" trong
 * tên/ảnh. Không khớp gì -> mặc định đầm/váy (tiệc).
 *
 * GẤM chỉ nhận theo MÃ SP "G..." (chủ shop chốt 16/08/2026) — cố tình KHÔNG
 * dò chữ "gấm" trong tên, vì nhiều mẫu đầm/áo dài có chữ "gấm" trong tên mà
 * không thuộc dòng gấm (vd "Gấm vóc lụa là", "AD12 Hồng gấm").
 */
export function deriveCategory(
  id: string,
  name: string,
  image: string | null,
): ProductCategory {
  const code = id.trim();
  if (/^ad/i.test(code)) return 'ao-dai';
  if (/^pp/i.test(code)) return 'phap-phuc';
  if (/^g/i.test(code)) return 'gam';

  const haystack = slugify(`${name} ${image ?? ''}`);
  if (haystack.includes('ao-dai') || haystack.includes('aodai')) {
    return 'ao-dai';
  }
  return 'dam-vay';
}
