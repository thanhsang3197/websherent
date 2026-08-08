'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';

/**
 * Hàng ngang cuộn cho danh sách gợi ý: mỗi lần bấm nút mờ (phải/trái) cuộn thêm.
 * Không tràn xuống hàng 2; nút tự ẩn khi ở đầu/cuối.
 */
export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update, products.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <li
            key={p.id}
            className="shrink-0 snap-start basis-[46%] sm:basis-[31%] lg:basis-[23%]"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      {/* Mờ dần ở mép — gợi ý còn mẫu phía sau (không chặn cuộn/bấm). */}
      {canLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-bg to-transparent"
        />
      )}
      {canRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-bg to-transparent"
        />
      )}

      {/* Nút trái (hiện khi đã cuộn) */}
      {canLeft && (
        <ArrowButton
          side="left"
          onClick={() => scrollByPage(-1)}
          label="Xem mẫu trước"
        />
      )}
      {/* Nút phải mờ — bấm để hiện thêm mẫu */}
      {canRight && (
        <ArrowButton
          side="right"
          onClick={() => scrollByPage(1)}
          label="Xem thêm mẫu"
        />
      )}
    </div>
  );
}

function ArrowButton({
  side,
  onClick,
  label,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  label: string;
}) {
  const isRight = side === 'right';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-[34%] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/70 text-accent-dark shadow-md ring-1 ring-hairline backdrop-blur transition hover:bg-surface ${
        isRight ? 'right-1' : 'left-1'
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={isRight ? '' : 'rotate-180'}
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}
