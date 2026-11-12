'use client';

import { useState } from 'react';
import { doiTrangThai, useTuiDo, type MonTrongTui } from '@/lib/tui-do';
import { thongBao } from '@/lib/hieu-ung';
import { hieuUngThemVaoTui } from '@/lib/hieu-ung-tui';

/**
 * Nút ♡ trên góc ảnh thẻ sản phẩm: thêm / bỏ mẫu khỏi "Túi đồ muốn thuê".
 * Đặt NGOÀI thẻ <Link> (định vị tuyệt đối lên khung ảnh) để không lồng nút
 * trong link.
 *
 * Thêm vào: tim nảy + chấm bay vào biểu tượng túi + thông báo "Xem túi"
 * (13/11/2026) — để khách biết chắc cú bấm đã có tác dụng.
 */
export function NutTui({ mon, className = '' }: { mon: MonTrongTui; className?: string }) {
  const tui = useTuiDo();
  const co = tui.some((m) => m.id === mon.id);
  const [nay, setNay] = useState(0);

  return (
    <button
      type="button"
      onClick={(e) => {
        const them = !co;
        doiTrangThai(mon);
        if (them) {
          setNay((n) => n + 1);
          hieuUngThemVaoTui(e.currentTarget, mon, tui);
        } else {
          thongBao({ noiDung: `Đã bỏ ${mon.name} khỏi túi` });
        }
      }}
      aria-pressed={co}
      aria-label={co ? `Bỏ ${mon.name} khỏi túi đồ` : `Thêm ${mon.name} vào túi đồ`}
      className={`nhan-co flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent shadow-md backdrop-blur transition-transform sm:h-10 sm:w-10 ${className}`}
    >
      <svg
        key={nay}
        className={nay > 0 ? 'tim-nay' : undefined}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={co ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
