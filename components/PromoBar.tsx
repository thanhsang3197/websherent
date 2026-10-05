'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { kieuLoai } from '@/lib/uu-dai';

const KHOA_LUU = 'sherent-uu-dai-da-tat';

/** Đổi sang chương trình kế tiếp sau từng này mili-giây. */
const DOI_SAU_MS = 5000;

export interface PromoBarItem {
  id: string;
  /** Mã loại — chọn biểu tượng đứng trước tiêu đề. */
  loai: string;
  tieuDe: string;
  loaiTen: string;
}

/** Đọc danh sách id ưu đãi khách đã bấm ✕. Lỗi (chế độ riêng tư…) -> coi như chưa tắt gì. */
function docDaTat(): string[] {
  try {
    const raw = window.localStorage.getItem(KHOA_LUU);
    const ds: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(ds) ? ds.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Thanh thông báo mỏng trên cùng MỌI trang: khách vào từ link sản phẩm cũng
 * thấy ưu đãi, không chỉ khách vào trang chủ.
 *
 * - Có nhiều chương trình thì tự xoay vòng; dừng khi rê chuột / chạm vào, và
 *   không tự xoay nếu khách bật "giảm chuyển động".
 * - Không dính khi cuộn (khác Header): chỉ tốn ~36px ở đầu trang, cuộn xuống
 *   là mất, không che ảnh mẫu.
 * - Khách bấm ✕ thì các chương trình đang hiện không hiện lại với họ; chương
 *   trình MỚI (id khác) vẫn hiện.
 *
 * SSR luôn vẽ thanh đầy đủ; ai đã tắt thì bị ẩn ngay sau khi trang nạp xong.
 */
export function PromoBar({ items }: { items: PromoBarItem[] }) {
  const [daTat, setDaTat] = useState<string[]>([]);
  const [chiSo, setChiSo] = useState(0);
  const [tamDung, setTamDung] = useState(false);
  const [giamChuyenDong, setGiamChuyenDong] = useState(false);

  useEffect(() => {
    setDaTat(docDaTat());
    setGiamChuyenDong(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const hien = items.filter((i) => !daTat.includes(i.id));
  const soCt = hien.length;

  useEffect(() => {
    if (soCt < 2 || tamDung || giamChuyenDong) return;
    const t = window.setInterval(() => setChiSo((i) => (i + 1) % soCt), DOI_SAU_MS);
    return () => window.clearInterval(t);
  }, [soCt, tamDung, giamChuyenDong]);

  if (soCt === 0) return null;

  // `chiSo` có thể vượt số chương trình sau khi khách tắt bớt.
  const cur = hien[chiSo % soCt];

  const tat = () => {
    const moi = Array.from(new Set([...daTat, ...hien.map((i) => i.id)]));
    setDaTat(moi);
    try {
      window.localStorage.setItem(KHOA_LUU, JSON.stringify(moi));
    } catch {
      // Không lưu được thì lần sau thanh hiện lại — chấp nhận được.
    }
  };

  return (
    <div
      role="region"
      aria-label="Ưu đãi"
      className="bg-accent-dark text-surface"
      onMouseEnter={() => setTamDung(true)}
      onMouseLeave={() => setTamDung(false)}
      onFocus={() => setTamDung(true)}
      onBlur={() => setTamDung(false)}
      onTouchStart={() => setTamDung(true)}
    >
      <div className="container-content flex min-h-9 items-center gap-2 text-[13px] sm:text-sm">
        <Link
          href={`/uu-dai#${cur.id}`}
          className="flex min-w-0 flex-1 items-center gap-2 py-1.5 hover:underline"
        >
          {/* Nhãn loại chỉ hiện từ sm: điện thoại cần chỗ cho tiêu đề hơn. */}
          <span className="hidden shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide sm:inline">
            {cur.loaiTen}
          </span>
          <span key={cur.id} className="uu-dai-doi min-w-0 truncate font-medium">
            {/* Biểu tượng hiện cả trên điện thoại, nơi nhãn chữ bị ẩn. */}
            <span aria-hidden="true">{kieuLoai(cur.loai).icon} </span>
            {cur.tieuDe}
          </span>
          <span className="shrink-0 font-semibold">Xem →</span>
        </Link>

        {soCt > 1 && (
          <span className="flex shrink-0 gap-1" aria-hidden="true">
            {hien.map((i, n) => (
              <span
                key={i.id}
                className={`h-1.5 w-1.5 rounded-full ${
                  n === chiSo % soCt ? 'bg-surface' : 'bg-surface/40'
                }`}
              />
            ))}
          </span>
        )}

        <button
          type="button"
          onClick={tat}
          aria-label="Đóng thông báo ưu đãi"
          className="-mr-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base leading-none hover:bg-white/15"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}
