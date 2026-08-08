'use client';

import { useEffect, useState } from 'react';

const KEY = 'sherent:recently-viewed';
const MAX = 12;

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Tính năng chỉ là tiện ích phụ — im lặng bỏ qua nếu localStorage bị chặn.
  }
}

/** Ghi nhận 1 slug vừa xem — gọi trong useEffect ở trang chi tiết sản phẩm. */
export function recordRecentlyViewed(slug: string) {
  const list = read().filter((s) => s !== slug);
  list.unshift(slug);
  write(list.slice(0, MAX));
}

/** Đọc danh sách slug đã xem gần đây (mới nhất trước) — dùng trong component client. */
export function useRecentlyViewed(): string[] {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    setList(read());
  }, []);
  return list;
}
