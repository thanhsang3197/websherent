'use client';

import { useEffect } from 'react';

/**
 * Cho các phần có `data-reveal` hiện dần khi cuộn tới: tiêu đề, rồi chữ, rồi
 * ảnh, mỗi phần trễ hơn phần trước ~80ms (theo thứ tự trong cùng một khối
 * `data-reveal-nhom`). Chỉ ẩn SAU KHI JS chạy (lớp `reveal-san` trên <html>),
 * nên lỗi script thì nội dung vẫn hiện đủ. Giảm chuyển động thì chỉ mờ dần.
 */
export function RevealRoot() {
  useEffect(() => {
    const ds = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (ds.length === 0 || !('IntersectionObserver' in window)) return;

    // Trễ theo thứ tự trong nhóm gần nhất.
    for (const el of ds) {
      const nhom = el.closest('[data-reveal-nhom]') ?? document.body;
      const anhEm = Array.from(nhom.querySelectorAll('[data-reveal]'));
      el.style.setProperty('--tre', `${Math.min(anhEm.indexOf(el), 6) * 80}ms`);
    }

    // Phần đã nằm trong màn hình lúc vào trang thì hiện ngay, không ẩn rồi mới hiện.
    const trongManHinh = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight * 0.92;
    for (const el of ds) if (trongManHinh(el)) el.classList.add('da-hien');
    document.documentElement.classList.add('reveal-san');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('da-hien');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const el of ds) if (!el.classList.contains('da-hien')) io.observe(el);
    return () => {
      io.disconnect();
      document.documentElement.classList.remove('reveal-san');
    };
  }, []);

  return null;
}
