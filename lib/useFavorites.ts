'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'sherent:favorites';
const EVENT = 'sherent:favorites-changed';

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
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // localStorage có thể bị chặn (duyệt web ẩn danh, cookie bị tắt...) — tính năng
    // yêu thích chỉ là tiện ích phụ, im lặng bỏ qua thay vì làm hỏng trải nghiệm chính.
  }
}

/**
 * Quản lý danh sách "yêu thích" bằng localStorage — không cần đăng nhập.
 * Đồng bộ giữa mọi component đang mở (CustomEvent) và giữa các tab (storage event).
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(read());
    const onChange = () => setFavorites(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [slug, ...current];
    write(next);
  }, []);

  return { favorites, isFavorite, toggle };
}
