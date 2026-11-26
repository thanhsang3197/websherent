import { getRentalProducts } from '@/lib/products';
import type { Product, ProductCategory } from '@/types/product';

/**
 * Số liệu giá THẬT của catalogue, tính từ dữ liệu app nội bộ — dùng trong bài
 * cẩm nang để không phải ghi cứng con số (shop đổi giá là bài tự đúng theo).
 */
export interface ThongKeLoai {
  soMau: number;
  /** Phí thuê 3 ngày: thấp nhất / phổ biến (trung vị) / cao nhất. */
  thue3Thap: number;
  thue3PhoBien: number;
  thue3Cao: number;
  /** Phí thuê 1 ngày thấp nhất; null nếu chưa mẫu nào nhập giá 1 ngày. */
  thue1Thap: number | null;
  /** Tiền cọc thấp nhất / phổ biến; null nếu chưa nhập. */
  cocThap: number | null;
  cocPhoBien: number | null;
  /** Size đang có, xếp theo số mẫu nhiều → ít. */
  sizes: string[];
  /** Mẫu có ảnh, ưu tiên NEW/HOT — để gợi ý trong bài. */
  mauNoiBat: Product[];
}

export type ThongKe = Record<ProductCategory, ThongKeLoai | null>;

const LOAI: ProductCategory[] = ['ao-dai', 'dam-vay', 'phap-phuc', 'gam', 'phu-kien'];

/** Trung vị, làm tròn về bội 10.000đ cho dễ đọc. */
function trungVi(so: number[]): number {
  const s = [...so].sort((a, b) => a - b);
  const giua = s[Math.floor(s.length / 2)];
  return Math.round(giua / 10_000) * 10_000;
}

function tinh(ds: Product[]): ThongKeLoai | null {
  const co = ds.filter((p) => p.rentPrice > 0);
  if (co.length === 0) return null;

  const thue3 = co.map((p) => p.rentPrice);
  const thue1 = co.map((p) => p.rentPrice1Day).filter((v): v is number => v != null && v > 0);
  const coc = co.map((p) => p.depositPrice).filter((v): v is number => v != null && v > 0);

  const demSize = new Map<string, number>();
  for (const p of co) for (const s of p.sizes) demSize.set(s, (demSize.get(s) ?? 0) + 1);
  // Bỏ size ghi chú lẻ ("L fit M L"…) — chỉ giữ size có từ 3 mẫu trở lên.
  const THU_TU = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Freesize'];
  const hang = (s: string) => (THU_TU.indexOf(s) === -1 ? 99 : THU_TU.indexOf(s));
  const sizes = [...demSize.entries()]
    .filter(([, n]) => n >= 3)
    .map(([s]) => s)
    .sort((a, b) => hang(a) - hang(b));

  const mauNoiBat = co
    .filter((p) => p.image)
    .sort((a, b) => Number(!!b.isNew || !!b.hot) - Number(!!a.isNew || !!a.hot))
    .slice(0, 8);

  return {
    soMau: co.length,
    thue3Thap: Math.min(...thue3),
    thue3PhoBien: trungVi(thue3),
    thue3Cao: Math.max(...thue3),
    thue1Thap: thue1.length ? Math.min(...thue1) : null,
    cocThap: coc.length ? Math.min(...coc) : null,
    cocPhoBien: coc.length ? trungVi(coc) : null,
    sizes,
    mauNoiBat,
  };
}

export async function getThongKeGia(): Promise<ThongKe> {
  const ds = await getRentalProducts();
  return Object.fromEntries(
    LOAI.map((loai) => [loai, tinh(ds.filter((p) => p.category === loai))]),
  ) as ThongKe;
}
