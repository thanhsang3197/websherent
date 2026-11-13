'use client';

import { useMemo } from 'react';
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

        <ul className="no-scrollbar -mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:gap-5 lg:mx-0 lg:px-0">
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
      </div>
    </section>
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
