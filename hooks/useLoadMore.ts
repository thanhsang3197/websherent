'use client';

import { useEffect, useState } from 'react';

/**
 * Phân trang phía client kiểu "xem thêm": hiện `pageSize` mục đầu, mỗi lần
 * gọi loadMore() lộ thêm `pageSize` mục. Reset về `pageSize` khi mảng gốc
 * đổi (do lọc/sort) để tránh lộ nhầm số lượng cũ.
 */
export function useLoadMore<T>(items: T[], pageSize: number) {
  const [count, setCount] = useState(pageSize);

  useEffect(() => {
    setCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = items.slice(0, count);
  const hasMore = count < items.length;
  const loadMore = () => setCount((c) => c + pageSize);

  return { visibleItems, hasMore, loadMore };
}
