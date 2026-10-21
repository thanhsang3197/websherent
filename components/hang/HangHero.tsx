'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import type { MauHang } from '@/lib/hang-khach';
import { HangTag } from '@/components/hang/HangTag';

export interface MucHero {
  key: string;
  ten: string;
  /** Dòng trên nhãn, vd "Giảm 15%". */
  nhan: string;
  /** Một câu dưới thẻ đang chọn: điều kiện + quyền lợi. */
  chiTiet: string;
  anh: string | null;
  mau: MauHang;
}

/** Thẻ mở đầu ở giữa khi vừa vào trang — hạng đầu tiên có quyền lợi. */
const MUC_DAU = 1;

/**
 * Hero trang hạng thành viên: các hạng đứng thành một vòng cung, mỗi hạng là
 * một chiếc đầm trong khung vòm với nhãn treo của hạng đó. Kéo / vuốt / phím
 * mũi tên / bấm thẻ bên cạnh để đưa một hạng ra giữa; nền cả khối đổi sang màu
 * của hạng đang ở giữa.
 *
 * Chưa chạy JS thì đây vẫn là một dải cuộn ngang bình thường, mọi thẻ đọc được.
 */
export function HangHero({ items, children }: { items: MucHero[]; children: ReactNode }) {
  const dai = useRef<HTMLUListElement>(null);
  const khung = useRef<number>(0);
  const [cur, setCur] = useState(MUC_DAU);
  // Ẩn dải tới khi đã cuộn tới thẻ mở đầu — không thì trước lúc JS chạy, ảnh
  // ở giữa là thẻ đầu còn tên bên dưới đã là thẻ thứ hai. <noscript> bên dưới
  // giữ dải hiện cho máy không chạy JS.
  const [san, setSan] = useState(false);

  // Mỗi thẻ: càng xa tâm càng nhỏ (−30% mỗi bậc), tối hơn, lệch lên/xuống so le.
  const veLai = useCallback(() => {
    const el = dai.current;
    if (!el) return;
    const tam = el.scrollLeft + el.clientWidth / 2;
    let gan = 0;
    let ganNhat = Infinity;
    Array.from(el.children).forEach((li, i) => {
      const o = li as HTMLElement;
      const d = (o.offsetLeft + o.offsetWidth / 2 - tam) / o.offsetWidth;
      const ad = Math.min(Math.abs(d), 3);
      if (ad < ganNhat) {
        ganNhat = ad;
        gan = i;
      }
      const vat = o.firstElementChild as HTMLElement | null;
      if (!vat) return;
      const lech = (i % 2 === 0 ? -1 : 1) * 22 * Math.min(ad, 1);
      vat.style.transform = `translateY(${lech}px) scale(${Math.pow(0.7, ad)})`;
      vat.style.filter = `brightness(${1 - 0.25 * Math.min(ad, 2)})`;
    });
    setCur(gan);
  }, []);

  const den = useCallback((i: number, muot = true) => {
    const el = dai.current;
    const li = el?.children[i] as HTMLElement | undefined;
    if (!el || !li) return;
    el.scrollTo({
      left: li.offsetLeft + li.offsetWidth / 2 - el.clientWidth / 2,
      behavior: muot ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => {
    den(Math.min(MUC_DAU, items.length - 1), false);
    veLai();
    setSan(true);
    const doi = () => veLai();
    window.addEventListener('resize', doi);
    return () => window.removeEventListener('resize', doi);
  }, [den, veLai, items.length]);

  const onScroll = () => {
    cancelAnimationFrame(khung.current);
    khung.current = requestAnimationFrame(veLai);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      den(Math.min(cur + 1, items.length - 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      den(Math.max(cur - 1, 0));
    }
  };

  const dangChon = items[cur] ?? items[0];

  return (
    <section
      aria-labelledby="hang-tieu-de"
      className="overflow-hidden pb-14 pt-10 transition-colors duration-300 sm:pb-20 sm:pt-14"
      // Nền là màu hạng pha nhạt với nền trang, để chiếc nhãn (màu hạng đậm) nổi lên.
      style={{ backgroundColor: `color-mix(in srgb, ${dangChon.mau.nen} 55%, rgb(var(--bg)))` }}
    >
      <div className="container-content">{children}</div>
      <noscript>
        <style>{`.hang-cung{opacity:1!important}`}</style>
      </noscript>

      <ul
        ref={dai}
        onScroll={onScroll}
        onKeyDown={onKey}
        tabIndex={0}
        aria-label="Các hạng thành viên — kéo ngang hoặc dùng phím mũi tên"
        style={{ opacity: san ? 1 : 0 }}
        className="hang-cung no-scrollbar mt-8 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain transition-opacity duration-700 px-[calc(50%-27.5vw)] focus-visible:outline-offset-[-4px] sm:mt-4 sm:px-[calc(50%-8.5rem)]"
      >
        {items.map((m, i) => (
          <li key={m.key} className="w-[55vw] shrink-0 snap-center sm:w-[17rem]">
            <button
              type="button"
              onClick={() => den(i)}
              tabIndex={-1}
              aria-label={`Xem hạng ${m.ten}`}
              aria-current={i === cur}
              className="relative mx-auto block w-[85%] origin-bottom py-8 transition-[transform,filter] duration-300 ease-out will-change-transform sm:w-[14.5rem]"
            >
              <span className="arch relative block aspect-[2/3] overflow-hidden bg-surface/60">
                {m.anh && (
                  <Image
                    src={m.anh}
                    alt=""
                    fill
                    priority={i <= 2}
                    placeholder="blur"
                    blurDataURL={GLASS_BLUR_DATA_URL}
                    sizes="(max-width: 640px) 50vw, 232px"
                    className="object-cover"
                  />
                )}
              </span>
              {/* Dây treo nhãn: vắt từ vai áo xuống lỗ xỏ của nhãn. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 60 70"
                className="absolute bottom-[7.6rem] right-[1.7rem] h-16 w-14 text-ink/70"
                fill="none"
              >
                <path d="M4 2 C 20 30, 50 30, 46 66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <HangTag ten={m.ten} dong={m.nhan} mau={m.mau} className="absolute -right-3 bottom-0 rotate-[6deg]" />
            </button>
          </li>
        ))}
      </ul>

      <div
        className="hang-cung container-content mt-2 text-center transition-opacity duration-700"
        style={{ opacity: san ? 1 : 0 }}
        aria-live="polite"
      >
        <p className="font-serif text-[1.875rem] leading-tight text-ink sm:text-5xl">
          {dangChon.ten}
        </p>
        <p className="mx-auto mt-2 max-w-md text-[17px] leading-relaxed text-ink">{dangChon.chiTiet}</p>
      </div>
    </section>
  );
}
