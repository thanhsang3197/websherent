'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site-config';

const phut = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "2 giờ 5 phút", "40 phút". */
function khoang(n: number): string {
  const h = Math.floor(n / 60);
  const m = n % 60;
  if (h === 0) return `${m} phút`;
  return m === 0 ? `${h} giờ` : `${h} giờ ${m} phút`;
}

/** Phút trong ngày theo giờ Việt Nam, dù máy khách đặt múi giờ nào. */
function bayGioVN(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const lay = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return lay('hour') * 60 + lay('minute');
}

function cauTrangThai(): string {
  const { opens, closes } = siteConfig.openingHours;
  const mo = phut(opens);
  const dong = phut(closes);
  const now = bayGioVN();
  if (now < mo) return `Hôm nay mở cửa lúc ${opens}, còn ${khoang(mo - now)}`;
  if (now < dong) return `Đang mở cửa, đóng lúc ${closes} (còn ${khoang(dong - now)})`;
  return `Đã đóng cửa, mở lại ${opens} ngày mai`;
}

/**
 * Tiệm đang mở hay đóng ngay lúc này, tính theo giờ mở cửa trong site-config.
 * Lúc render ở máy chủ (và khi chưa chạy JS) chỉ ghi khung giờ cố định, để
 * trang lưu cache không bao giờ báo sai "đang mở".
 */
export function TrangThaiMoCua({ className = '' }: { className?: string }) {
  const [cau, setCau] = useState<string | null>(null);

  useEffect(() => {
    setCau(cauTrangThai());
    const id = window.setInterval(() => setCau(cauTrangThai()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} aria-live="polite">
      {cau ?? `Mở cửa ${siteConfig.openingHours.opens} – ${siteConfig.openingHours.closes} hằng ngày`}
    </span>
  );
}
