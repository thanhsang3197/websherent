'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';

/**
 * Nút liên hệ dùng lại nhiều nơi: Nhắn Zalo + Gọi.
 * Tự động sao chép tin nhắn mẫu khi nhấn Zalo để dán nhanh vào khung chat.
 */
export function ContactButtons({
  className = '',
  zaloLabel = 'Nhắn Zalo giữ mẫu',
  /** Nội dung gợi ý khi khách bấm Zalo (đưa vào aria-label & copy text). */
  contextLabel,
}: {
  className?: string;
  zaloLabel?: string;
  contextLabel?: string;
}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleZaloClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (contextLabel && typeof navigator !== 'undefined' && navigator.clipboard) {
      const msg = `Hi ${siteConfig.name}, mình muốn tư vấn giữ mẫu: ${contextLabel}`;
      navigator.clipboard.writeText(msg).then(() => {
        showToast('Đã sao chép tin nhắn mẫu! Đang mở Zalo...');
      }).catch(() => {
        // Mở Zalo bình thường nếu clipboard không khả dụng
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <>
      <div className={`flex flex-wrap gap-3 ${className}`}>
        <a
          href={siteConfig.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleZaloClick}
          className="btn btn-primary"
          aria-label={
            contextLabel
              ? `Nhắn Zalo cho ${siteConfig.name} về ${contextLabel}`
              : `Nhắn Zalo cho ${siteConfig.name}`
          }
        >
          <ChatIcon />
          {zaloLabel}
        </a>
        <a
          href={`tel:${siteConfig.phone.tel}`}
          className="btn btn-outline"
          aria-label={`Gọi ${siteConfig.name} số ${siteConfig.phone.display}`}
        >
          <PhoneIcon />
          Gọi {siteConfig.phone.display}
        </a>
      </div>

      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-accent-dark px-5 py-2.5 text-xs font-medium text-surface shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 sm:text-sm">
          ✨ {toastMessage}
        </div>
      )}
    </>
  );
}

function ChatIcon() {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5z" />
    </svg>
  );
}

function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
