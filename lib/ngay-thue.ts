'use client';

import { useSyncExternalStore } from 'react';

/**
 * Ngày nhận / ngày trả khách chọn (chủ shop chốt 13/11/2026 — "mục 1": chỉ ghi
 * ngày vào tin nhắn gửi tiệm, web KHÔNG kiểm tra hay hiện lịch trống).
 *
 * Dùng chung cho trang chi tiết và trang túi đồ, lưu localStorage để khách
 * chọn một lần là cả hai nơi cùng thấy. Ngày đã qua tự bị xoá khi đọc lại.
 */

export interface NgayThue {
  /** 'YYYY-MM-DD' hoặc '' nếu chưa chọn. */
  nhan: string;
  tra: string;
}

const KHOA = 'sherent-ngay-thue';
const SU_KIEN = 'sherent:ngay-thue';
const TRONG: NgayThue = { nhan: '', tra: '' };

let cache: NgayThue | null = null;

/** Hôm nay theo giờ máy khách, dạng 'YYYY-MM-DD'. */
export function homNay(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function congNgay(iso: string, so: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(y, m - 1, d + so);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/** '2026-12-20' -> '20/12 (CN)'. Rỗng -> ''. */
export function hienNgay(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(y, m - 1, d);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')} (${THU[t.getDay()]})`;
}

/** Hai dòng ngày trong tin nhắn gửi tiệm; chưa chọn thì để "..." cho khách tự điền. */
export function dongNgayTinNhan(n: NgayThue): string {
  return `Ngày nhận: ${hienNgay(n.nhan) || '...'}\nNgày trả: ${hienNgay(n.tra) || '...'}`;
}

function doc(): NgayThue {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KHOA);
    const v = raw ? (JSON.parse(raw) as NgayThue) : TRONG;
    // Ngày nhận đã qua -> bỏ cả hai, khỏi gửi nhầm ngày cũ cho tiệm.
    cache = v.nhan && v.nhan < homNay() ? TRONG : { nhan: v.nhan || '', tra: v.tra || '' };
  } catch {
    cache = TRONG;
  }
  return cache;
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

export function useNgayThue(): NgayThue {
  return useSyncExternalStore(subscribe, doc, () => TRONG);
}

export function datNgayThue(n: NgayThue) {
  cache = n;
  try {
    window.localStorage.setItem(KHOA, JSON.stringify(n));
  } catch {
    // Trình duyệt chặn lưu -> vẫn chạy trong phiên này.
  }
  window.dispatchEvent(new Event(SU_KIEN));
}
