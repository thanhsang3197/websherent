'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Dải cuộn ngang có nút ‹ › cho máy tính (điện thoại vẫn vuốt, nút ẩn dưới sm).
 * Nút chỉ hiện khi còn chỗ để cuộn về phía đó; mỗi lần bấm cuộn ~1 khung.
 */
export function DaiCuonNgang({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [nut, setNut] = useState({ trai: false, phai: false });
  const capNhat = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setNut({ trai: el.scrollLeft > 4, phai: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    capNhat();
    window.addEventListener('resize', capNhat);
    return () => window.removeEventListener('resize', capNhat);
  }, [capNhat, children]);
  const cuon = (chieu: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: chieu * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <ul ref={ref} onScroll={capNhat} className={className}>
        {children}
      </ul>
      {nut.trai && <Nut trai onClick={() => cuon(-1)} />}
      {nut.phai && <Nut onClick={() => cuon(1)} />}
    </div>
  );
}

function Nut({ trai = false, onClick }: { trai?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={trai ? 'Cuộn sang trái' : 'Cuộn sang phải'}
      className={`absolute top-[34%] z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-surface shadow-lg transition hover:scale-105 hover:bg-accent-dark sm:flex ${
        trai ? '-left-2' : '-right-2'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={trai ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  );
}
