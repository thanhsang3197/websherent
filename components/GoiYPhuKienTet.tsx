import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';

/**
 * Nhóm phụ kiện gợi ý đi kèm áo dài chụp Tết, đúng thứ tự chủ shop đặt
 * (04/11/2026). Khoá là chữ đầu tên mẫu (VH01 -> "vh", "Kẹp 03" -> "kẹp"),
 * cùng cách gom nhóm với mục Phụ kiện ở trang chủ.
 */
const NHOM_GOI_Y = ['vh', 'h', 'k', 'c', 'q', 'guốc', 'kẹp', 'trâm'];

const LINK_PHU_KIEN = '/?loai=phu-kien#san-pham';

function loai(p: Product): string {
  return p.name.trim().replace(/\s*\d.*$/, '').toLowerCase();
}

function soTen(p: Product): number {
  return Number(p.name.match(/\d+/)?.[0] ?? 0);
}

/**
 * Khối nhỏ dưới nút liên hệ ở trang áo dài: mỗi nhóm phụ kiện một ảnh đại diện
 * (mẫu số nhỏ nhất có ảnh). Bấm ảnh nào cũng sang mục Phụ kiện để khách xem
 * toàn bộ mẫu — mục đích là dẫn khách qua đó, không phải bán từng món ở đây.
 */
export function GoiYPhuKienTet({ products }: { products: Product[] }) {
  const daiDien = NHOM_GOI_Y.map((nhom) =>
    products
      .filter((p) => p.category === 'phu-kien' && p.image && loai(p) === nhom)
      .sort((a, b) => soTen(a) - soTen(b))[0],
  ).filter((p): p is Product => Boolean(p));

  if (daiDien.length === 0) return null;

  return (
    <div className="mt-6 max-w-md">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink">Phụ kiện áo dài chụp Tết</p>
        <Link
          href={LINK_PHU_KIEN}
          className="shrink-0 text-xs font-medium text-accent-dark underline-offset-4 hover:underline sm:text-sm"
        >
          Xem tất cả →
        </Link>
      </div>
      <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {daiDien.map((p) => (
          <li key={p.id}>
            <Link
              href={LINK_PHU_KIEN}
              aria-label={`Xem phụ kiện, ví dụ ${p.name}`}
              className="group relative block aspect-square overflow-hidden rounded-xl bg-tint shadow-sm ring-1 ring-white/70 transition-all hover:shadow-md hover:ring-accent/50"
            >
              <Image
                src={p.image as string}
                alt={p.name}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-110"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
