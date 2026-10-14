'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

// useLayoutEffect báo lỗi khi render ở server — chỉ dùng nó trên trình duyệt.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Tiêu đề TỰ CO CHỮ cho vừa MỘT dòng (chủ shop 15/10/2026): tên mẫu dài như
 * "AD25 Tịch Nhiên Hồng Ruốc" trên điện thoại rớt xuống dòng hai. Tên vừa một
 * dòng thì giữ nguyên cỡ chữ gốc (do `className` quyết định), chỉ tên dài mới
 * nhỏ lại — vừa đủ để lọt.
 *
 * Có sàn `minPx`: tên dài tới mức phải nhỏ hơn sàn thì thôi không ép nữa, để
 * nó xuống dòng ở cỡ sàn — chữ bé quá khó đọc còn tệ hơn hai dòng.
 *
 * Đo lại khi khung đổi bề rộng (xoay ngang máy, kéo cửa sổ) và khi font chữ
 * tải xong (font serif về muộn hơn chữ dự phòng, bề rộng chữ đổi theo).
 */
export function TieuDeMotDong({
  children,
  className = '',
  minPx = 18,
}: {
  children: ReactNode;
  className?: string;
  minPx?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const vuaKhung = () => {
      // Về cỡ gốc trong className rồi mới đo, để lần đo nào cũng xuất phát
      // từ cùng một mốc.
      el.style.fontSize = '';
      el.style.whiteSpace = 'nowrap';
      const goc = parseFloat(getComputedStyle(el).fontSize);
      const rong = el.clientWidth;
      const can = el.scrollWidth;
      if (can <= rong) return; // vừa sẵn -> giữ nguyên
      // Trừ hao 0,5px: làm tròn subpixel đôi khi vẫn dư ra một chút.
      const moi = Math.floor((goc * (rong - 0.5)) / can * 10) / 10;
      if (moi >= minPx) {
        el.style.fontSize = `${moi}px`;
      } else {
        el.style.fontSize = `${minPx}px`;
        el.style.whiteSpace = '';
      }
    };

    vuaKhung();
    const ro = new ResizeObserver(vuaKhung);
    ro.observe(el.parentElement ?? el);
    document.fonts?.ready.then(vuaKhung).catch(() => {});
    return () => ro.disconnect();
  }, [children, minPx]);

  return (
    // `width: 0` + `min-width: 100%`: h1 vẫn rộng đúng bằng khung, nhưng KHÔNG
    // khai bề rộng chữ lên trên. Thiếu cặp này thì lúc đặt nowrap để đo, chữ dài
    // đẩy cả cột lưới rộng ra theo -> đo thấy "vừa" và không co gì cả.
    <h1 ref={ref} className={className} style={{ width: 0, minWidth: '100%' }}>
      {children}
    </h1>
  );
}
