'use client';

import { useEffect, useState } from 'react';
import { siteConfig, mapsDirectionsUrl } from '@/lib/site-config';

/** Hiện sau khi khách cuộn qua khỏi Hero (không che nội dung ngay đầu trang). */
const SHOW_AFTER_PX = 480;

/**
 * Nút nổi tròn ở góc dưới bên phải — CHỈ hiện trên mobile (header desktop đã có
 * sẵn nút Zalo luôn thấy). Tự ẩn khi khách cuộn tới gần Footer để không đè lên
 * khối "Liên hệ giữ mẫu" đã có sẵn ở đó.
 *
 * Hai nút: chỉ đường Google Maps (nút phụ) và nhắn Zalo (nút chính).
 */
export function StickyContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');

    const onScroll = () => {
      const pastHero = window.scrollY > SHOW_AFTER_PX;
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const nearFooter = footerTop < window.innerHeight;
      setVisible(pastHero && !nearFooter);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-5 right-4 z-30 flex flex-col items-center gap-3 transition-all duration-300 md:hidden ${
        visible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-3 scale-90 opacity-0'
      }`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a
        href={mapsDirectionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        aria-label={`Chỉ đường tới ${siteConfig.name} trên Google Maps`}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink shadow-[0_4px_14px_rgba(0,0,0,0.15)] ring-1 ring-hairline transition hover:bg-tint"
      >
        <MapPinIcon />
      </a>

      <a
        href={siteConfig.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        aria-label={`Nhắn Zalo cho ${siteConfig.name}`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-surface shadow-[0_6px_18px_rgba(176,106,79,0.45)] transition hover:bg-accent-dark"
      >
        {/* Vòng lan nhẹ để thu hút chú ý — tự tắt nếu khách bật giảm chuyển động. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping motion-safe:[animation-duration:2.5s]"
          style={{ opacity: 0.35 }}
        />
        <ChatIcon />
      </a>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5z" />
    </svg>
  );
}

/** Ghim bản đồ — cùng bộ nét vẽ với ChatIcon để hai nút nhìn thành một cặp. */
function MapPinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
