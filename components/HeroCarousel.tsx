'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

const INTERVAL_MS = 5000; // đổi ảnh mỗi 5 giây
const ANIM_MS = 700; // thời lượng hiệu ứng trượt

const SIZES = '(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px';

/**
 * Slideshow ảnh hero: tự đổi mỗi 5s, hiệu ứng trượt phải→trái.
 * Tôn trọng prefers-reduced-motion: không tự chạy nếu người dùng bật giảm chuyển động.
 * Rỗng -> khung monogram; 1 ảnh -> ảnh tĩnh.
 */
export function HeroCarousel({
  images,
}: {
  images: { url: string; alt: string }[];
}) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const lastRef = useRef(0);

  // Tự động chuyển ảnh (bỏ qua nếu <=1 ảnh hoặc người dùng giảm chuyển động).
  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  // Khi ảnh hiện tại đổi -> giữ ảnh cũ lại để trượt ra, rồi bỏ sau khi xong.
  useEffect(() => {
    if (lastRef.current === current) return;
    setPrev(lastRef.current);
    lastRef.current = current;
    const t = setTimeout(() => setPrev(null), ANIM_MS);
    return () => clearTimeout(t);
  }, [current]);

  if (images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-tint">
        <span className="font-serif text-7xl text-accent/60">
          {siteConfig.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <>
      {prev !== null && prev !== current && (
        <div key={`prev-${prev}`} className="absolute inset-0 hero-slide-out">
          <Image
            src={images[prev].url}
            alt=""
            aria-hidden
            fill
            placeholder="blur"
            blurDataURL={GLASS_BLUR_DATA_URL}
            sizes={SIZES}
            className="object-cover"
          />
        </div>
      )}
      <div
        key={`cur-${current}`}
        className={`absolute inset-0 ${prev !== null ? 'hero-slide-in' : ''}`}
      >
        <Image
          src={images[current].url}
          alt={images[current].alt}
          fill
          priority={current === 0}
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes={SIZES}
          className="object-cover"
        />
      </div>
    </>
  );
}
