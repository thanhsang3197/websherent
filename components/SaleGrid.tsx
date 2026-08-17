'use client';

import type { Product } from '@/types/product';
import { SaleCard } from '@/components/SaleCard';
import { useLoadMore } from '@/hooks/useLoadMore';

const PAGE_SIZE = 40;

/**
 * Lưới sản phẩm trang thanh lý, có nút "Xem thêm" thay vì render hết cùng lúc.
 */
export function SaleGrid({ products }: { products: Product[] }) {
  const { visibleItems, hasMore, loadMore } = useLoadMore(products, PAGE_SIZE);

  return (
    <>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {visibleItems.map((product, i) => (
          <li key={product.id} className="flex">
            <SaleCard product={product} priority={i < 4} />
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
    </>
  );
}
