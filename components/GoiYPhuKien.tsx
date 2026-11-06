import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductCategory } from '@/types/product';
import { nhomPhuKien } from '@/lib/mapping';

/**
 * Nhóm phụ kiện gợi ý theo loại sản phẩm, đúng thứ tự hiển thị. Khoá nhóm là
 * chữ đầu tên mẫu (VH01 -> "vh", "Choàng tà dài 01" -> "choàng tà dài"), cùng
 * cách gom nhóm với mục Phụ kiện ở trang chủ.
 *
 * - Áo dài: chủ shop đặt 04/11/2026 (đồ cài tóc, quạt, guốc cho ảnh Tết).
 * - Đầm váy: chủ shop yêu cầu 06/11/2026 là KHÁC áo dài, nên dùng túi (T),
 *   dây chuyền (D), choàng và kính.
 * - Pháp phục: chủ shop yêu cầu 06/11/2026 là GIỐNG áo dài.
 */
const NHOM_AO_DAI = ['vh', 'h', 'k', 'c', 'q', 'guốc', 'kẹp', 'trâm'];

const GOI_Y: Partial<Record<ProductCategory, { tieuDe: string; nhom: string[] }>> = {
  'ao-dai': { tieuDe: 'Phụ kiện áo dài chụp Tết', nhom: NHOM_AO_DAI },
  'phap-phuc': { tieuDe: 'Phụ kiện đi cùng pháp phục', nhom: NHOM_AO_DAI },
  'dam-vay': {
    tieuDe: 'Phụ kiện đi cùng đầm váy',
    nhom: [
      't',
      'd',
      'choàng khoác đen',
      'choàng khoác trắng',
      'choàng tà dài',
      'choàng tà ngắn be',
      'choàng ren ò',
      'kính',
    ],
  },
};

const LINK_PHU_KIEN = '/?loai=phu-kien#san-pham';

/** Trang chi tiết dùng để biết có cần tải catalogue cho khối gợi ý hay không. */
export function coGoiYPhuKien(category: ProductCategory): boolean {
  return category in GOI_Y;
}

function soTen(p: Product): number {
  return Number(p.name.match(/\d+/)?.[0] ?? 0);
}

/**
 * Khối nhỏ dưới nút liên hệ ở trang chi tiết: mỗi nhóm phụ kiện một ảnh đại diện
 * (mẫu số nhỏ nhất có ảnh). Bấm ảnh là sang mục Phụ kiện, cuộn sẵn tới đúng
 * nhóm đó (`?nhom=`) — khách vẫn ở danh sách đầy đủ, xem tiếp các nhóm khác.
 */
export function GoiYPhuKien({
  category,
  products,
}: {
  category: ProductCategory;
  products: Product[];
}) {
  const goiY = GOI_Y[category];
  if (!goiY) return null;

  const daiDien = goiY.nhom
    .map(
      (nhom) =>
        products
          .filter((p) => p.category === 'phu-kien' && p.image && nhomPhuKien(p) === nhom)
          .sort((a, b) => soTen(a) - soTen(b))[0],
    )
    .filter((p): p is Product => Boolean(p));

  if (daiDien.length === 0) return null;

  return (
    <div className="mt-6 max-w-md">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink">{goiY.tieuDe}</p>
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
              href={`/?loai=phu-kien&nhom=${encodeURIComponent(nhomPhuKien(p))}#san-pham`}
              aria-label={`Xem phụ kiện nhóm ${p.name.replace(/\s*\d.*$/, '')}`}
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
