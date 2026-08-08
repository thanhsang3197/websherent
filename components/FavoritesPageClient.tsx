'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { useFavorites } from '@/lib/useFavorites';
import { ProductGrid } from '@/components/ProductGrid';

/**
 * Nội dung trang "Yêu thích" — client component vì danh sách chỉ có ý nghĩa
 * theo trình duyệt của từng khách (localStorage), không có gì để render sẵn ở server.
 */
export function FavoritesPageClient() {
  const { favorites } = useFavorites();
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch('/api/san-pham')
      .then((res) => res.json())
      .then((data: { products: Product[] }) => setAllProducts(data.products))
      .catch(() => setAllProducts([]));
  }, []);

  if (allProducts === null) {
    return <p className="py-16 text-center text-muted">Đang tải…</p>;
  }

  const bySlug = new Map(allProducts.map((p) => [p.slug, p]));
  const items = favorites
    .map((slug) => bySlug.get(slug))
    .filter((p): p is Product => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">
          Bạn chưa lưu mẫu nào. Bấm biểu tượng ❤ trên mẫu bạn thích để lưu lại đây.
        </p>
        <Link
          href="/#san-pham"
          className="btn btn-primary mt-6 inline-flex"
        >
          Xem bộ sưu tập
        </Link>
      </div>
    );
  }

  return <ProductGrid products={items} />;
}
