import type { Product, ProductCategory } from '@/types/product';
import { listRentPrice } from '@/lib/format';

/**
 * "Túi đồ muốn thuê" (chủ shop chốt 13/11/2026): khách bấm ♡ / "Thêm vào túi"
 * để gom nhiều mẫu, rồi gửi CẢ danh sách cho tiệm qua Zalo/Messenger một lần.
 * Đủ `SO_MAU_GIAM` mẫu thì tạm tính tự trừ ưu đãi 10%.
 *
 * Lưu trong localStorage của máy khách — không có tài khoản, không gửi lên
 * máy chủ nào. Mỗi món giữ một bản CHỤP giá lúc thêm; giá cuối cùng vẫn do tiệm
 * xác nhận khi nhắn (trang túi đồ ghi rõ điều đó).
 *
 * File này THUẦN (không hook, không window) để cả server component dùng được;
 * phần kho lưu trên máy khách nằm ở lib/tui-do.ts ('use client').
 */

export const SO_MAU_GIAM = 3;
export const PHAN_TRAM_GIAM = 10;

export interface MonTrongTui {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  size: string | null;
  image: string | null;
  /** Mức giá hiện trên thẻ (1 ngày nếu có, không thì 3 ngày) — xem `listRentPrice`. */
  price: number;
  days: 1 | 3;
  deposit: number;
  /** Thiếu ở món lưu từ bản cũ -> đoán theo mã (PK… = phụ kiện). */
  category?: ProductCategory;
}

/**
 * Loại được tính vào mốc "thuê từ 3 váy" (chủ shop 13/11/2026): váy đầm, áo
 * dài, pháp phục, gấm. Phụ kiện vẫn nằm trong túi, vẫn cộng tiền, nhưng KHÔNG
 * được đếm để đủ mốc ưu đãi.
 */
const LOAI_TINH_UU_DAI: ProductCategory[] = ['dam-vay', 'ao-dai', 'phap-phuc', 'gam'];

export function tinhVaoUuDai(m: MonTrongTui): boolean {
  if (m.category) return LOAI_TINH_UU_DAI.includes(m.category);
  return !m.id.toUpperCase().startsWith('PK');
}

export function monTuSanPham(p: Product): MonTrongTui {
  const rent = listRentPrice(p);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    size: p.sizes.length ? p.sizes.join('/') : null,
    image: p.image,
    price: rent.price,
    days: rent.days,
    deposit: p.depositPrice,
    category: p.category,
  };
}

/** Tạm tính: tổng phí thuê, phần giảm (nếu đủ mẫu), tổng cọc. */
export function tamTinh(list: MonTrongTui[]) {
  const phiThue = list.reduce((a, m) => a + (m.price > 0 ? m.price : 0), 0);
  const soMauTinh = list.filter(tinhVaoUuDai).length;
  const duGiam = soMauTinh >= SO_MAU_GIAM;
  const giam = duGiam ? Math.round((phiThue * PHAN_TRAM_GIAM) / 100 / 1000) * 1000 : 0;
  const coc = list.reduce((a, m) => a + (m.deposit > 0 ? m.deposit : 0), 0);
  // Giảm 10% trên TỔNG hoá đơn (cả phụ kiện) — chỉ điều kiện đủ mốc là đếm riêng trang phục.
  return { phiThue, giam, duGiam, coc, soMauTinh, conThieu: Math.max(0, SO_MAU_GIAM - soMauTinh) };
}
