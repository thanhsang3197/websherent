'use client';

import { useMemo, useState } from 'react';
import { CATEGORY_LABELS, type Product } from '@/types/product';
import { SaleCard } from '@/components/SaleCard';
import { NEN_O } from '@/lib/thanh-ly';
import { useLoadMore } from '@/hooks/useLoadMore';

const PAGE_SIZE = 40;

type PriceBucket = 'all' | 'lt100' | '100-200' | '200-500' | '500-1000';
type SortDir = 'asc' | 'desc';

// Dải riêng biệt (không cộng dồn). Mẫu chưa chốt giá (0) chỉ nằm trong "Tất cả".
const PRICE_BANDS: { id: Exclude<PriceBucket, 'all'>; label: string; test: (p: number) => boolean }[] = [
  { id: 'lt100', label: 'Dưới 100k', test: (p) => p > 0 && p <= 100_000 },
  { id: '100-200', label: '100k – 200k', test: (p) => p > 100_000 && p <= 200_000 },
  { id: '200-500', label: '200k – 500k', test: (p) => p > 200_000 && p <= 500_000 },
  { id: '500-1000', label: '500k – 1 triệu', test: (p) => p > 500_000 && p <= 1_000_000 },
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
 * Lưới sản phẩm trang thanh lý: tìm theo tên/loại/thương hiệu + lọc theo mức giá bán + sắp xếp
 * giá, có nút "Xem thêm" thay vì render hết cùng lúc.
 *
 * Hàng nút mức giá (kèm số mẫu từng mức) dính ngay dưới header khi cuộn, để
 * trên điện thoại khách đổi mức giá mà không phải cuộn ngược lên đầu.
 */
export function SaleGrid({ products }: { products: Product[] }) {
  const [q, setQ] = useState('');
  const [priceBucket, setPriceBucket] = useState<PriceBucket>('all');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Mức giá nào không có mẫu thì ẩn nút luôn.
  const bands = useMemo(
    () =>
      PRICE_BANDS.map((b) => ({ ...b, count: products.filter((p) => b.test(p.sale?.price ?? 0)).length })).filter(
        (b) => b.count > 0,
      ),
    [products],
  );

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    const testPrice = priceBucketTest(priceBucket);

    let list = products.filter((p) => {
      // Tìm cả theo loại đồ và thương hiệu: gõ "áo dài" ra mẫu áo dài dù tên là "AD58 Diên Vỹ".
      if (nq && !norm(`${p.name} ${CATEGORY_LABELS[p.category]} ${p.brand ?? ''}`).includes(nq)) return false;
      if (!testPrice(p.sale?.price ?? 0)) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const pa = a.sale?.price ?? 0;
      const pb = b.sale?.price ?? 0;
      // Giá 0 ("liên hệ") luôn xuống cuối, dù sắp chiều nào.
      if (pa === 0 !== (pb === 0)) return pa === 0 ? 1 : -1;
      return sortDir === 'asc' ? pa - pb : pb - pa;
    });

    return list;
  }, [products, q, priceBucket, sortDir]);

  const { visibleItems, hasMore, loadMore } = useLoadMore(filtered, PAGE_SIZE);
  const conLai = filtered.length - visibleItems.length;

  const nut = (dang: boolean) =>
    `flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] transition active:scale-[0.97] ${
      dang ? 'bg-ink text-surface' : 'bg-tint text-ink hover:bg-accent/20'
    }`;

  return (
    <>
      <div className="max-w-xl">
        <label htmlFor="thanh-ly-tim" className="sr-only">
          Tìm theo tên mẫu, loại đồ hoặc thương hiệu
        </label>
        <input
          id="thanh-ly-tim"
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên mẫu, áo dài, thương hiệu…"
          className="w-full rounded-full bg-tint/70 px-5 py-3.5 text-base text-ink placeholder:text-ink/55 focus:bg-tint focus-visible:outline-accent"
        />
      </div>

      {/* Hàng lọc dính dưới header (header + thanh ưu đãi cao ~5.25rem trên điện thoại). */}
      <div className="sticky top-[5.3rem] z-20 -mx-5 mt-4 bg-bg px-5 py-2.5 sm:top-[6.5rem]">
        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label="Lọc theo mức giá"
            className="no-scrollbar -mx-5 flex flex-1 gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <button type="button" aria-pressed={priceBucket === 'all'} onClick={() => setPriceBucket('all')} className={nut(priceBucket === 'all')}>
              Tất cả <span className="tabular-nums opacity-70">{products.length}</span>
            </button>
            {bands.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={priceBucket === b.id}
                onClick={() => setPriceBucket(b.id)}
                className={nut(priceBucket === b.id)}
              >
                {b.label} <span className="tabular-nums opacity-70">{b.count}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            aria-label={
              sortDir === 'asc'
                ? 'Đang sắp xếp giá thấp đến cao, bấm để đổi sang cao đến thấp'
                : 'Đang sắp xếp giá cao đến thấp, bấm để đổi sang thấp đến cao'
            }
            className="hidden min-h-[44px] shrink-0 items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-accent-dark sm:flex"
          >
            {sortDir === 'asc' ? 'Giá thấp → cao' : 'Giá cao → thấp'}
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-[15px] text-ink/75">
          {filtered.length === products.length
            ? `${products.length} mẫu đang pass`
            : `${filtered.length} / ${products.length} mẫu`}
        </p>
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="min-h-[44px] text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 sm:hidden"
        >
          {sortDir === 'asc' ? 'Giá thấp → cao' : 'Giá cao → thấp'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 bg-tint/60 px-5 py-10 text-center">
          <p className="text-lg text-ink">Không có mẫu nào khớp.</p>
          <button
            type="button"
            onClick={() => {
              setQ('');
              setPriceBucket('all');
            }}
            className="mt-3 min-h-[44px] text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4"
          >
            Xem lại tất cả mẫu
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
          {visibleItems.map((product, i) => (
            <li key={product.id} className="flex">
              <SaleCard product={product} priority={i < 4} nen={NEN_O[i % NEN_O.length]} />
            </li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="min-h-[48px] rounded-full bg-tint px-7 text-[15px] font-medium text-ink transition hover:bg-accent/20 active:scale-[0.97]"
          >
            Xem thêm {Math.min(conLai, PAGE_SIZE)} mẫu
          </button>
        </div>
      ) : filtered.length > 0 ? (
        <p className="mt-12 text-center text-[15px] text-ink/70">Bạn đã xem hết {filtered.length} mẫu.</p>
      ) : null}
    </>
  );
}
