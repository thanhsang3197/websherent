'use client';

import { useEffect, useState } from 'react';

/**
 * Phân trang phía client kiểu "xem thêm": hiện `pageSize` mục đầu, mỗi lần
 * gọi loadMore() lộ thêm `pageSize` mục. Reset về `pageSize` khi mảng gốc
 * đổi (do lọc/sort) để tránh lộ nhầm số lượng cũ.
 */
export function useLoadMore<T>(items: T[], pageSize: number, minCount = 0) {
  const [count, setCount] = useState(pageSize);

  useEffect(() => {
    setCount(pageSize);
  }, [items, pageSize]);

  // `minCount`: buộc lộ sẵn tới mục đó (vd khách được dẫn thẳng tới một nhóm
  // phụ kiện nằm sâu dưới danh sách).
  const shown = Math.max(count, minCount);
  const visibleItems = items.slice(0, shown);
  const hasMore = shown < items.length;
  const loadMore = () => setCount(shown + pageSize);

  return { visibleItems, hasMore, loadMore };
}
