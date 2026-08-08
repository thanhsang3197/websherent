'use client';

import { useEffect } from 'react';
import Image from 'next/image';

/**
 * Xem ảnh phóng to toàn màn hình. Đóng bằng ESC/bấm nền/nút X;
 * chuyển ảnh bằng phím mũi tên hoặc nút trái-phải (nếu nhiều ảnh).
 */
export function Lightbox({
  images,
  index,
  alt,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowRight') {
        onNavigate((index + 1) % images.length);
      }
      if (hasMultiple && e.key === 'ArrowLeft') {
        onNavigate((index - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    // Khoá cuộn nền trong lúc xem phóng to.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, images.length, hasMultiple, onClose, onNavigate]);

  const current = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ảnh phóng to: ${alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface/15 text-surface backdrop-blur transition hover:bg-surface/25"
      >
        <XIcon />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/15 text-surface backdrop-blur transition hover:bg-surface/25 sm:left-4"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/15 text-surface backdrop-blur transition hover:bg-surface/25 sm:right-4"
          >
            <ArrowIcon direction="right" />
          </button>
        </>
      )}

      <div
        className="relative h-[75vh] w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {hasMultiple && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-surface/80">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={direction === 'left' ? 'rotate-180' : ''}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
