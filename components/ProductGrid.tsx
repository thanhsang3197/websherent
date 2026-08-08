'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';

/**
 * Lưới sản phẩm responsive: 2 cột mobile -> 3 -> 4 trên màn lớn.
 */
export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  /** Số card đầu ưu tiên tải ảnh (LCP). */
  priorityCount?: number;
}) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        Không tìm thấy mẫu phù hợp. Thử bỏ bớt bộ lọc nhé.
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              priority={i < priorityCount}
              onQuickView={setQuickViewProduct}
            />
          </li>
        ))}
      </ul>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
