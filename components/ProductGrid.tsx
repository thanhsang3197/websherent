'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { QuickViewModal } from '@/components/QuickViewModal';
import { useLoadMore } from '@/hooks/useLoadMore';

const PAGE_SIZE = 40;

/**
 * Lưới sản phẩm responsive: 2 cột mobile -> 3 -> 4 trên màn lớn.
 * Chỉ render PAGE_SIZE mẫu mỗi lần, có nút "Xem thêm" để tải thêm.
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
  const { visibleItems, hasMore, loadMore } = useLoadMore(products, PAGE_SIZE);

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
        {visibleItems.map((product, i) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              priority={i < priorityCount}
              onQuickView={setQuickViewProduct}
            />
          </li>
        ))}
      </ul>

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={loadMore} className="btn btn-outline">
            Xem thêm sản phẩm
          </button>
        </div>
      ) : (
        <p className="mt-10 animate-fade-up text-center text-sm text-muted">
          Bạn đã xem hết {products.length} mẫu
        </p>
      )}

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
