import type { Product } from '@/types/product';

/**
 * FLASH SALE trên trang Thanh lý (chủ shop chốt 14/11/2026): cứ mỗi 48 tiếng
 * bốc ngẫu nhiên 10 mẫu đang pass và giảm thêm 10% so với giá pass shop ghi.
 *
 * Bốc "ngẫu nhiên" nhưng TẤT ĐỊNH theo số thứ tự đợt: mọi khách (và nhân viên
 * tiệm) mở web trong cùng một đợt đều thấy cùng 10 mẫu, cùng giá — khách nhắn
 * "mẫu flash sale" thì tiệm mở web ra là thấy đúng mẫu đó. Không cần lưu gì ở
 * máy chủ, trang vẫn là trang tĩnh ISR.
 *
 * Cách bốc: mỗi mẫu được một điểm = băm(số đợt + mã mẫu), lấy 10 điểm nhỏ nhất.
 * Nhờ vậy khi giữa đợt có mẫu bán xong (rời danh sách), 9 mẫu còn lại vẫn giữ
 * nguyên, chỉ thêm một mẫu bù vào — không xáo trộn cả bộ.
 *
 * File THUẦN (không hook) để cả trang server lẫn component client dùng chung.
 */

export const SO_MAU_FLASH = 10;
export const PHAN_TRAM_FLASH = 10;
const DO_DAI_DOT_MS = 48 * 60 * 60 * 1000;
/** Mốc đợt 0: 00:00 ngày 14/11/2026 giờ Việt Nam. Đợt đổi lúc 0 giờ, cách ngày. */
const MOC = Date.UTC(2026, 10, 13, 17, 0, 0);

export function dotHienTai(now: number = Date.now()): number {
  return Math.floor((now - MOC) / DO_DAI_DOT_MS);
}

/** Thời điểm (ms) đợt `dot` kết thúc. */
export function ketThucDot(dot: number): number {
  return MOC + (dot + 1) * DO_DAI_DOT_MS;
}

/** Băm FNV-1a 32 bit — đủ trộn đều, không cần thư viện. */
function bam(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // Trộn thêm (fmix32 của MurmurHash3): mã mẫu na ná nhau ("AD065", "AD067")
  // mà chỉ dùng FNV thì điểm cũng na ná, bốc ra cả cụm mẫu liền mã.
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Chỉ mẫu đã chốt giá pass mới được vào flash sale (mẫu "liên hệ" thì không có gì để giảm). */
export function duocVaoFlash(p: Pick<Product, 'sale'>): boolean {
  return (p.sale?.price ?? 0) > 0;
}

/** Mã các mẫu flash sale của đợt `dot`. */
export function chonMauFlash(products: Pick<Product, 'id' | 'sale'>[], dot: number): Set<string> {
  const ds = products
    .filter(duocVaoFlash)
    .map((p) => ({ id: p.id, diem: bam(`${dot}:${p.id}`) }))
    .sort((a, b) => a.diem - b.diem || a.id.localeCompare(b.id))
    .slice(0, SO_MAU_FLASH);
  return new Set(ds.map((x) => x.id));
}

/** Giá sau khi giảm flash, làm tròn tới nghìn đồng. */
export function giaFlash(giaPass: number): number {
  return Math.round((giaPass * (100 - PHAN_TRAM_FLASH)) / 100 / 1000) * 1000;
}

/** "1 ngày 04:12:09" / "04:12:09" — đếm ngược tới `het` (ms). */
export function dinhDangConLai(conMs: number): { ngay: number; gio: string; phut: string; giay: string } {
  const s = Math.max(0, Math.floor(conMs / 1000));
  const hai = (n: number) => String(n).padStart(2, '0');
  return {
    ngay: Math.floor(s / 86400),
    gio: hai(Math.floor((s % 86400) / 3600)),
    phut: hai(Math.floor((s % 3600) / 60)),
    giay: hai(s % 60),
  };
}
