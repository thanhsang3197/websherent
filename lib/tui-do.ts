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
  ghiQua([]);
}

// ----- Phụ kiện khách chọn làm quà ưu đãi áo dài (lib/uu-dai-ao-dai.ts) -----
// Chỉ lưu mã; món nào còn hợp lệ với mốc hiện tại do trang túi đồ tự lọc lại.

const KHOA_QUA = 'sherent-tui-do-qua';
let cacheQua: string[] | null = null;

function docQua(): string[] {
  if (cacheQua) return cacheQua;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KHOA_QUA) ?? '[]');
    cacheQua = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    cacheQua = [];
  }
  return cacheQua;
}

function ghiQua(ids: string[]) {
  cacheQua = ids;
  try {
    window.localStorage.setItem(KHOA_QUA, JSON.stringify(ids));
  } catch {
    // Không lưu được thì vẫn chạy trong phiên này.
  }
  window.dispatchEvent(new Event(SU_KIEN));
}

const RONG_QUA: string[] = [];
function subscribeQua(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KHOA_QUA) {
      cacheQua = null;
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

export function useQuaAoDai(): string[] {
  return useSyncExternalStore(subscribeQua, docQua, () => RONG_QUA);
}

/**
 * Bấm một phụ kiện quà: đang chọn thì bỏ; chưa chọn thì thêm, quá `toiDa` món
 * thì đẩy món chọn sớm nhất ra (mốc 1 quà = bấm món khác là đổi quà).
 * `hopLe`: các mã đang hợp lệ — món cũ không còn hợp lệ bị bỏ luôn.
 */
export function bamQuaAoDai(id: string, toiDa: number, hopLe: string[]) {
  const dang = docQua().filter((x) => hopLe.includes(x));
  if (dang.includes(id)) return ghiQua(dang.filter((x) => x !== id));
  ghiQua([...dang, id].slice(-toiDa));
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
