'use client';

import type { Product } from '@/types/product';
import { useRecentlyViewed } from '@/lib/useRecentlyViewed';
import { ProductCarousel } from '@/components/ProductCarousel';

/**
 * "Mẫu đã xem gần đây" — chỉ hiện khi trình duyệt khách có lịch sử (localStorage),
 * nên KHÔNG render gì ở lần ghé đầu tiên. Nhận toàn bộ danh sách sản phẩm từ trang
 * chủ (đã có sẵn cho bộ lọc) để lọc theo slug, không cần gọi API riêng.
 */
export function RecentlyViewedSection({ products }: { products: Product[] }) {
  const recentSlugs = useRecentlyViewed();
  if (recentSlugs.length === 0) return null;

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const items = recentSlugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Product => Boolean(p));
  if (items.length === 0) return null;

  return (
    <section className="container-content py-10">
      <h2 className="font-serif text-2xl text-accent-dark">Mẫu bạn đã xem</h2>
      <div className="mt-6">
        <ProductCarousel products={items} />
      </div>
    </section>
  );
}
