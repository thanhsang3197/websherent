'use client';

import { useSyncExternalStore } from 'react';
import type { MonTrongTui } from '@/lib/tui-do-mon';

/** Kho "Túi đồ muốn thuê" trên máy khách (localStorage). Kiểu + tính tiền: lib/tui-do-mon.ts. */
export { SO_MAU_GIAM, PHAN_TRAM_GIAM, tamTinh, type MonTrongTui } from '@/lib/tui-do-mon';

const KHOA = 'sherent-tui-do';
const SU_KIEN = 'sherent:tui-do';
const RONG: MonTrongTui[] = [];

let cache: MonTrongTui[] | null = null;

function doc(): MonTrongTui[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KHOA);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? (parsed as MonTrongTui[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function ghi(list: MonTrongTui[]) {
  cache = list;
  try {
    window.localStorage.setItem(KHOA, JSON.stringify(list));
  } catch {
    // Trình duyệt chặn lưu (ẩn danh…) -> túi vẫn chạy trong phiên này.
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

/** Danh sách món trong túi; server render luôn thấy túi rỗng. */
export function useTuiDo(): MonTrongTui[] {
  return useSyncExternalStore(subscribe, doc, () => RONG);
}

export function themVaoTui(mon: MonTrongTui) {
  const list = doc();
  if (list.some((m) => m.id === mon.id)) return;
  ghi([...list, mon]);
}

export function boKhoiTui(id: string) {
  ghi(doc().filter((m) => m.id !== id));
}

export function doiTrangThai(mon: MonTrongTui) {
  if (doc().some((m) => m.id === mon.id)) boKhoiTui(mon.id);
  else themVaoTui(mon);
}

export function xoaHetTui() {
  ghi([]);
}

/**
 * Thay món đã có trong túi bằng bản mới (cùng mã) — vd khách đổi từ "thuê 1
 * ngày" sang "thuê 3 ngày" ở trang chi tiết sau khi đã thêm vào túi. Món chưa
 * có trong túi thì bỏ qua.
 */
export function capNhatMon(mon: MonTrongTui) {
  const list = doc();
  if (!list.some((m) => m.id === mon.id)) return;
  ghi(list.map((m) => (m.id === mon.id ? mon : m)));
}
