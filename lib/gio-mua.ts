'use client';

import { useSyncExternalStore } from 'react';
import type { GioMua, MonMua } from '@/lib/gio-mua-mon';

/**
 * Kho "Giỏ mua thanh lý" trên máy khách (localStorage) — cùng cách làm với
 * lib/tui-do.ts. Kiểu + tính tiền: lib/gio-mua-mon.ts.
 */

const KHOA = 'sherent-gio-mua';
const SU_KIEN = 'sherent:gio-mua';
const RONG: GioMua = { mon: [], qua: null };

let cache: GioMua | null = null;

function doc(): GioMua {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KHOA);
    const parsed = raw ? JSON.parse(raw) : null;
    cache =
      parsed && Array.isArray(parsed.mon)
        ? { mon: parsed.mon as MonMua[], qua: (parsed.qua as MonMua | null) ?? null }
        : RONG;
  } catch {
    cache = RONG;
  }
  return cache;
}

function ghi(gio: GioMua) {
  cache = gio;
  try {
    window.localStorage.setItem(KHOA, JSON.stringify(gio));
  } catch {
    // Trình duyệt chặn lưu (ẩn danh…) -> giỏ vẫn chạy trong phiên này.
  }
  window.dispatchEvent(new Event(SU_KIEN));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KHOA) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(SU_KIEN, cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SU_KIEN, cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useGioMua(): GioMua {
  return useSyncExternalStore(subscribe, doc, () => RONG);
}

export function coTrongGio(id: string): boolean {
  return doc().mon.some((m) => m.id === id);
}

export function themVaoGio(mon: MonMua) {
  const g = doc();
  if (g.mon.some((m) => m.id === mon.id)) return;
  // Mẫu đang là quà mà khách mua luôn -> bỏ khỏi ô quà.
  ghi({ mon: [...g.mon, mon], qua: g.qua?.id === mon.id ? null : g.qua });
}

export function boKhoiGio(id: string) {
  const g = doc();
  ghi({ ...g, mon: g.mon.filter((m) => m.id !== id) });
}

export function chonQua(mon: MonMua | null) {
  ghi({ ...doc(), qua: mon });
}

export function xoaHetGio() {
  ghi(RONG);
}
