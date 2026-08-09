'use client';

import { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import { Lightbox } from '@/components/Lightbox';

/**
 * Gallery ảnh sản phẩm: ảnh chính (khung vòm) + dải ảnh nhỏ bấm để xem.
 * Bấm vào ảnh chính -> mở xem phóng to toàn màn hình (Lightbox).
 * 1 ảnh -> chỉ hiện ảnh chính. 0 ảnh -> khung monogram.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const current = images[active];

  return (
    <div className="w-full max-w-sm">
      <div className="relative">
        <div
          aria-hidden="true"
          className="arch absolute -right-3 -top-3 h-full w-full border border-accent/40"
        />
        <div className="arch relative aspect-[3/4] w-full overflow-hidden bg-tint">
          {current ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Xem ảnh phóng to"
              className="group absolute inset-0 h-full w-full cursor-zoom-in"
            >
              <Image
                key={current}
                src={current}
                alt={alt}
                fill
                priority
                placeholder="blur"
                blurDataURL={GLASS_BLUR_DATA_URL}
                sizes="(max-width: 1024px) 90vw, 384px"
                className="object-cover"
              />
              <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/50 text-surface opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <ZoomIcon />
              </span>
            </button>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-tint">
              <span className="font-serif text-6xl text-accent/45">
                {siteConfig.name.charAt(0)}
              </span>
              <span className="text-xs text-muted">Ảnh đang cập nhật</span>
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === active}
                className={`relative block h-16 w-12 overflow-hidden rounded-md ring-1 transition ${
                  i === active
                    ? 'ring-2 ring-accent'
                    : 'ring-hairline hover:ring-accent/50'
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={GLASS_BLUR_DATA_URL}
                  sizes="48px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightboxOpen && current && (
        <Lightbox
          images={images}
          index={active}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActive}
        />
      )}
    </div>
  );
}

function ZoomIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
    </svg>
  );
}
