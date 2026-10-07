'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import { trackMessengerClick, trackZaloClick, type ViTri } from '@/lib/analytics';

/**
 * Nút liên hệ dùng lại nhiều nơi: Nhắn Zalo + Nhắn Messenger.
 * Tự động sao chép tin nhắn mẫu khi nhấn để dán nhanh vào khung chat.
 *
 * Nút thứ hai trước đây là "Gọi 0982 476 969" — đổi sang Messenger theo yêu
 * cầu chủ shop 02/10/2026 vì khách hầu như không gọi. Số điện thoại vẫn còn
 * ở Footer.
 */
export function ContactButtons({
  className = '',
  zaloLabel = 'Nhắn Zalo giữ mẫu',
  /** Nội dung gợi ý khi khách bấm Zalo (đưa vào aria-label & copy text). */
  contextLabel,
  viTri,
  maSp,
  compact = false,
}: {
  className?: string;
  /** Bản nhỏ gọn (nút thấp, chữ nhỏ) — cho khối phụ như lời mời gửi ảnh. */
  compact?: boolean;
  zaloLabel?: string;
  contextLabel?: string;
  /** Chỗ đặt cặp nút này — ghi kèm vào sự kiện analytics (lib/analytics.ts). */
  viTri: ViTri;
  /** Mã SP nếu cặp nút gắn với một mẫu cụ thể. */
  maSp?: string | null;
}) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const copyTemplate = (appName: string) => {
    if (contextLabel && typeof navigator !== 'undefined' && navigator.clipboard) {
      const msg = `Hi ${siteConfig.name}, mình muốn tư vấn giữ mẫu: ${contextLabel}`;
      navigator.clipboard.writeText(msg).then(() => {
        showToast(`Đã sao chép tin nhắn mẫu! Đang mở ${appName}...`);
      }).catch(() => {
        // Mở app bình thường nếu clipboard không khả dụng
      });
    }
  };

  const handleZaloClick = () => {
    trackZaloClick(viTri, maSp);
    copyTemplate('Zalo');
  };

  const handleMessengerClick = () => {
    trackMessengerClick(viTri, maSp);
    copyTemplate('Messenger');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /*
    Hai nút LUÔN bằng nhau và chung một dòng (grid 2 cột), ở mọi chỗ dùng:
    trang chi tiết, Giới thiệu, Hỏi đáp.

    Cỡ chữ co theo bề rộng KHUNG CHỨA (đơn vị cqi), không theo màn hình (vw):
    khung hẹp mà dùng vw thì chữ vẫn to và icon bị ép về 0px. Công thức tính
    cho nhãn dài ~8,2em (nhãn cũ "Gọi 0982 476 969"; "Nhắn Messenger" ngắn
    hơn nên càng dư): chữ ≤ ((khung − 8) / 2 − 40) / 8,2 -> 5,6cqi − 5px.
    `max-w-md` để trên trang rộng hai nút không bị kéo dài quá mức.
  */
  const sizeClass = compact
    ? 'min-w-0 gap-1 whitespace-nowrap px-2 py-2 text-xs shadow-md [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0'
    : 'min-w-0 gap-1.5 whitespace-nowrap px-2 text-[clamp(10.5px,calc(5.6cqi-5px),15.2px)] [&>svg]:shrink-0';

  return (
    <>
      <div
        className={`grid w-full ${compact ? 'max-w-xs' : 'max-w-md'} grid-cols-2 gap-2 [container-type:inline-size] ${className}`}
      >
        <a
          href={siteConfig.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleZaloClick}
          className={`btn btn-primary ${sizeClass}`}
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
          href={siteConfig.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleMessengerClick}
          className={`btn btn-primary ${sizeClass}`}
          aria-label={
            contextLabel
              ? `Nhắn Messenger cho ${siteConfig.name} về ${contextLabel}`
              : `Nhắn Messenger cho ${siteConfig.name}`
          }
        >
          <MessengerIcon />
          Nhắn Messenger
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

function MessengerIcon() {
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
      <path d="M12 2.5c-5.3 0-9.5 3.9-9.5 9 0 2.8 1.3 5.3 3.5 7v3.3l3.2-1.8c.9.3 1.8.4 2.8.4 5.3 0 9.5-3.9 9.5-9s-4.2-8.9-9.5-8.9z" />
      <path d="m7 13.5 3.2-3.4 2.4 2.3 3.4-3.4-3.2 3.4-2.4-2.3z" />
    </svg>
  );
}
