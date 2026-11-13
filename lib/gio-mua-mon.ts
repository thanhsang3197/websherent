import type { Product } from '@/types/product';
import { giaFlash } from '@/lib/flash-sale';

/**
 * "Giỏ mua thanh lý" (chủ shop chốt 14/11/2026): khách gom nhiều mẫu pass rồi
 * gửi MỘT tin nhắn cho tiệm, thấy ngay tổng tiền và còn thiếu bao nhiêu để được
 * tặng mẫu. Đủ mốc thì khách TỰ CHỌN mẫu quà trên web.
 *
 * Tách riêng với "Túi đồ muốn thuê" (lib/tui-do-mon.ts): một bên là thuê có
 * ngày nhận/trả + cọc, một bên là mua đứt.
 *
 * File THUẦN (không hook, không window) để server component cũng dùng được.
 */

/**
 * Quà tặng khi mua thanh lý — chủ shop đặt, chưa có bên app nên ghi cứng ở đây.
 * Đổi / tắt chương trình thì sửa (hoặc để rỗng) mảng này. Sắp theo `don` tăng dần.
 * Đơn tính theo giá khách THỰC TRẢ (đã trừ flash sale), chưa gồm phí ship.
 */
export const QUA_TANG: { don: number; tang: number }[] = [
  { don: 300_000, tang: 50_000 },
  { don: 500_000, tang: 100_000 },
];

export interface MonMua {
  id: string;
  slug: string;
  name: string;
  size: string | null;
  image: string | null;
  /** Giá pass shop ghi (chưa trừ flash) — bản chụp lúc thêm vào giỏ. */
  giaPass: number;
  note: string | null;
}

export interface GioMua {
  mon: MonMua[];
  /** Mẫu khách chọn làm quà (nếu đã đủ mốc). */
  qua: MonMua | null;
}

export function monMuaTuSanPham(p: Product): MonMua {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    size: p.sizes.length ? p.sizes.join('/') : null,
    image: p.image,
    giaPass: p.sale?.price ?? 0,
    note: p.sale?.note ?? null,
  };
}

/** Giá khách trả cho một món: giá flash nếu mẫu đang flash sale. */
export function giaThuc(m: Pick<MonMua, 'id' | 'giaPass'>, flash: Set<string>): number {
  if (!(m.giaPass > 0)) return 0;
  return flash.has(m.id) ? giaFlash(m.giaPass) : m.giaPass;
}

export function tinhGio(gio: GioMua, flash: Set<string>) {
  const tong = gio.mon.reduce((a, m) => a + giaThuc(m, flash), 0);
  const tongGoc = gio.mon.reduce((a, m) => a + (m.giaPass > 0 ? m.giaPass : 0), 0);
  const coMonLienHe = gio.mon.some((m) => !(m.giaPass > 0));
  // Mốc cao nhất đã đạt và mốc kế tiếp.
  const moc = [...QUA_TANG].reverse().find((q) => tong >= q.don) ?? null;
  const mocKe = QUA_TANG.find((q) => tong < q.don) ?? null;
  // Quà chỉ hợp lệ khi còn đủ mốc và giá quà không vượt mức được tặng.
  const qua = gio.qua && moc && gio.qua.giaPass <= moc.tang && !gio.mon.some((m) => m.id === gio.qua!.id) ? gio.qua : null;
  return {
    tong,
    tietKiem: tongGoc - tong,
    coMonLienHe,
    moc,
    mocKe,
    conThieu: mocKe ? mocKe.don - tong : 0,
    qua,
  };
}
