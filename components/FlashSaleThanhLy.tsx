'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types/product';
import { SaleCard, IconSet } from '@/components/SaleCard';
import { NEN_O } from '@/lib/thanh-ly';
import { PHAN_TRAM_FLASH } from '@/lib/flash-sale';
import { useConLai, useMauFlash } from '@/lib/use-flash-sale';

/**
 * Dải FLASH SALE đầu trang Thanh lý: 10 mẫu giảm thêm 10% trong 48 giờ, kèm
 * đồng hồ đếm ngược (chủ shop chốt 14/11/2026). Cách bốc mẫu: lib/flash-sale.ts.
 * Lướt ngang trên điện thoại để danh sách chính vẫn ở gần đầu trang.
 */
export function FlashSaleThanhLy({ products }: { products: Product[] }) {
  const { dot, ids } = useMauFlash(products);
  const conLai = useConLai(dot);
  const mau = useMemo(() => products.filter((p) => ids.has(p.id)), [products, ids]);

  const dayRef = useRef<HTMLUListElement>(null);
  const [nut, setNut] = useState({ trai: false, phai: false });
  const capNhatNut = useCallback(() => {
    const el = dayRef.current;
    if (!el) return;
    setNut({
      trai: el.scrollLeft > 4,
      phai: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);
  useEffect(() => {
    capNhatNut();
    window.addEventListener('resize', capNhatNut);
    return () => window.removeEventListener('resize', capNhatNut);
  }, [capNhatNut, mau.length]);
  // Mỗi lần bấm cuộn đúng một "trang" (số thẻ đang thấy).
  const cuon = (chieu: 1 | -1) => {
    const el = dayRef.current;
    if (el) el.scrollBy({ left: chieu * el.clientWidth, behavior: 'smooth' });
  };

  // Chưa gắn kết: giữ chỗ cùng chiều cao để trang không giật khi dải hiện ra.
  const dangTai = dot === null;
  if (!dangTai && mau.length === 0) return null;

  return (
    <section aria-labelledby="tl-flash" className="bg-accent/[0.08] py-7 sm:py-10">
      <div className="container-content">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.12em] text-accent-dark">
              <IconSet size={14} /> Flash sale 48 giờ
            </p>
            <h2 id="tl-flash" className="mt-1 font-serif text-[1.75rem] leading-tight text-ink sm:text-[2.25rem]">
              Giảm thêm {PHAN_TRAM_FLASH}%
            </h2>
          </div>
          <DongHo conLai={conLai} />
        </div>

        <div className="relative">
        <ul
          ref={dayRef}
          onScroll={capNhatNut}
          className="no-scrollbar -mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-1 sm:gap-5 lg:mx-0 lg:px-0"
        >
          {dangTai
            ? Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="w-[44%] shrink-0 sm:w-[30%] lg:w-[calc(25%-15px)]">
                  <div className={`${NEN_O[i % NEN_O.length]} aspect-[3/4.9]`} />
                </li>
              ))
            : mau.map((p, i) => (
                <li key={p.id} className="flex w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc(25%-15px)]">
                  <SaleCard product={p} nen={NEN_O[i % NEN_O.length]} flash />
                </li>
              ))}
        </ul>
          {/* Nút cuộn ngang: ẩn trên điện thoại (đã có vuốt), ẩn khi đã chạm đầu/cuối dải. */}
          {nut.trai && <NutCuon huong="trai" onClick={() => cuon(-1)} />}
          {nut.phai && <NutCuon huong="phai" onClick={() => cuon(1)} />}
        </div>
      </div>
    </section>
  );
}

function NutCuon({ huong, onClick }: { huong: 'trai' | 'phai'; onClick: () => void }) {
  const trai = huong === 'trai';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={trai ? 'Xem mẫu trước' : 'Xem thêm mẫu'}
      className={`absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-surface shadow-lg transition hover:scale-105 hover:bg-accent-dark sm:flex ${
        trai ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={trai ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  );
}

function DongHo({ conLai }: { conLai: ReturnType<typeof useConLai> }) {
  const o = (so: string | number, nhan: string) => (
    <span className="flex min-w-[52px] flex-col items-center rounded-xl bg-ink px-2 py-1.5 text-surface">
      <span className="text-[1.25rem] font-bold leading-none tabular-nums">{so}</span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-surface/70">{nhan}</span>
    </span>
  );
  return (
    <div className="flex items-center gap-2" role="timer" aria-live="off">
      <span className="mr-1 text-[13px] text-ink/70">Kết thúc sau</span>
      {conLai ? (
        <>
          {conLai.ngay > 0 && o(conLai.ngay, 'ngày')}
          {o(conLai.gio, 'giờ')}
          {o(conLai.phut, 'phút')}
          {o(conLai.giay, 'giây')}
        </>
      ) : (
        o('--', 'giờ')
      )}
    </div>
  );
}
