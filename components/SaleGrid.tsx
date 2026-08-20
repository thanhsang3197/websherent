'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types/product';
import { SaleCard } from '@/components/SaleCard';
import { useLoadMore } from '@/hooks/useLoadMore';

const PAGE_SIZE = 40;

type PriceBucket = 'all' | 'lt100' | '100-200' | '200-500' | '500-1000';
type SortDir = 'asc' | 'desc';

// Dải riêng biệt (không cộng dồn), khớp với countPassRange() ở app/thanh-ly/page.tsx.
const PRICE_BANDS: { id: Exclude<PriceBucket, 'all'>; label: string; test: (p: number) => boolean }[] = [
  { id: 'lt100', label: 'Dưới 100k', test: (p) => p > 0 && p <= 100_000 },
  { id: '100-200', label: '100k – 200k', test: (p) => p > 100_000 && p <= 200_000 },
  { id: '200-500', label: '200k – 500k', test: (p) => p > 200_000 && p <= 500_000 },
  { id: '500-1000', label: '500k – 1000k', test: (p) => p > 500_000 && p <= 1_000_000 },
];

function priceBucketTest(bucket: PriceBucket): (p: number) => boolean {
  if (bucket === 'all') return () => true;
  return PRICE_BANDS.find((b) => b.id === bucket)!.test;
}

/** Bỏ dấu để tìm kiếm không phân biệt dấu ("ao dai" khớp "Áo dài"). */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Lưới sản phẩm trang thanh lý: tìm theo tên + lọc theo mức giá bán + sắp xếp
 * giá, có nút "Xem thêm" thay vì render hết cùng lúc.
 */
export function SaleGrid({ products }: { products: Product[] }) {
  const [q, setQ] = useState('');
  const [priceBucket, setPriceBucket] = useState<PriceBucket>('all');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [priceMenuOpen, setPriceMenuOpen] = useState(false);
  const priceMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!priceMenuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (!priceMenuRef.current?.contains(e.target as Node)) {
        setPriceMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [priceMenuOpen]);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    const testPrice = priceBucketTest(priceBucket);

    let list = products.filter((p) => {
      if (nq && !norm(p.name).includes(nq)) return false;
      if (!testPrice(p.sale?.price ?? 0)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const pa = a.sale?.price ?? 0;
      const pb = b.sale?.price ?? 0;
      return sortDir === 'asc' ? pa - pb : pb - pa;
    });

    return list;
  }, [products, q, priceBucket, sortDir]);

  const { visibleItems, hasMore, loadMore } = useLoadMore(filtered, PAGE_SIZE);

  return (
    <>
      <div className="relative z-20 mt-6 rounded-3xl glass-panel p-4 shadow-glass sm:p-5">
        <label htmlFor="thanh-ly-tim" className="sr-only">
          Tìm theo tên mẫu
        </label>
        <input
          id="thanh-ly-tim"
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên mẫu…"
          className="w-full rounded-full glass-input px-5 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div
            className="flex flex-wrap gap-1.5 rounded-2xl glass-pill p-1.5 sm:rounded-full"
            role="group"
            aria-label="Lọc theo mức giá"
          >
            <button
              type="button"
              aria-pressed={priceBucket === 'all'}
              onClick={() => setPriceBucket('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap sm:text-sm ${
                priceBucket === 'all'
                  ? 'bg-gradient-to-r from-accent to-accent-dark text-surface shadow-md scale-[1.02]'
                  : 'text-ink/80 hover:text-accent-dark hover:bg-white/40'
              }`}
            >
              Tất cả
            </button>

            <div className="relative" ref={priceMenuRef}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={priceMenuOpen}
                onClick={() => setPriceMenuOpen((v) => !v)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap sm:text-sm ${
                  priceBucket !== 'all'
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-surface shadow-md scale-[1.02]'
                    : 'text-ink/80 hover:text-accent-dark hover:bg-white/40'
                }`}
              >
                {priceBucket === 'all'
                  ? 'Theo mức giá'
                  : PRICE_BANDS.find((b) => b.id === priceBucket)?.label}
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className={`h-3.5 w-3.5 transition-transform ${priceMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 8l5 5 5-5" />
                </svg>
              </button>

              {priceMenuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-2xl glass-panel py-1.5 shadow-glass-lg"
                >
                  {PRICE_BANDS.map((b) => {
                    const active = priceBucket === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setPriceBucket(b.id);
                          setPriceMenuOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                          active
                            ? 'font-semibold text-accent-dark'
                            : 'text-ink/80 hover:bg-white/40 hover:text-accent-dark'
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            title={sortDir === 'asc' ? 'Giá: thấp → cao' : 'Giá: cao → thấp'}
            aria-label={
              sortDir === 'asc'
                ? 'Đang sắp xếp giá thấp đến cao, bấm để đổi sang cao đến thấp'
                : 'Đang sắp xếp giá cao đến thấp, bấm để đổi sang thấp đến cao'
            }
            className="ml-auto flex items-center gap-1.5 rounded-full glass-pill px-3 py-2 text-sm font-medium text-ink/80 transition-all hover:text-accent-dark hover:bg-white/40"
          >
            {sortDir === 'asc' ? (
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 14V4M6 4 3 7M6 4l3 3" />
                <path d="M11 6h6M11 10h4M11 14h2" />
              </svg>
            ) : (
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6v10M6 16l-3-3M6 16l3-3" />
                <path d="M11 6h2M11 10h4M11 14h6" />
              </svg>
            )}
            <span className="hidden sm:inline">
              {sortDir === 'asc' ? 'Giá thấp → cao' : 'Giá cao → thấp'}
            </span>
          </button>
        </div>

        <p aria-live="polite" className="mt-3 text-sm text-muted">
          {filtered.length === products.length
            ? `${products.length} mẫu`
            : `${filtered.length} / ${products.length} mẫu`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          Không tìm thấy mẫu nào khớp bộ lọc.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((product, i) => (
            <li key={product.id} className="flex">
              <SaleCard product={product} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={loadMore} className="btn btn-outline">
            Xem thêm sản phẩm
          </button>
        </div>
      ) : filtered.length > 0 ? (
        <p className="mt-10 animate-fade-up text-center text-sm text-muted">
          Bạn đã xem hết {filtered.length} mẫu
        </p>
      ) : null}
    </>
  );
}
