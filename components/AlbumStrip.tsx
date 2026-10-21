'use client';

import { useEffect, useRef, useState } from 'react';
import type { Album } from '@/types/album';
import { AlbumCard } from '@/components/AlbumCard';

/**
 * Dải album ngang: luôn một hàng, vuốt / cuộn ngang, bám từng thẻ. Thẻ cuối
 * lộ một phần để khách biết còn nữa. Máy tính không vuốt được bằng chuột nên
 * có nút ‹ › cuộn mượt đúng một khung nhìn.
 */
export function AlbumStrip({ albums }: { albums: Album[] }) {
  const dai = useRef<HTMLUListElement>(null);
  const [dau, setDau] = useState(true);
  const [cuoi, setCuoi] = useState(false);
  // Ẩn nút ‹ khi đang ở đầu dải, nút › khi đã tới cuối.
  const doViTri = () => {
    const el = dai.current;
    if (!el) return;
    setDau(el.scrollLeft <= 4);
    setCuoi(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };
  // Đo lại khi vừa hiện và khi đổi cỡ màn hình — ít album thì không tràn, ẩn cả hai nút.
  useEffect(() => {
    doViTri();
    window.addEventListener('resize', doViTri);
    return () => window.removeEventListener('resize', doViTri);
  }, []);
  const cuon = (huong: 1 | -1) => {
    const el = dai.current;
    if (el) el.scrollBy({ left: huong * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-6">
      <ul
        ref={dai}
        onScroll={doViTri}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-5 sm:mx-0 sm:gap-4 sm:scroll-px-0 sm:px-0"
      >
        {albums.map((album) => (
          <li
            key={album.slug}
            className="w-[42vw] shrink-0 snap-start sm:w-[calc((100%-2rem)/3.3)] lg:w-[calc((100%-3rem)/4.3)]"
          >
            <AlbumCard album={album} viTri="trang-chu" sizes="(max-width: 640px) 42vw, (max-width: 1024px) 30vw, 23vw" />
          </li>
        ))}
      </ul>
      <NutCuon huong={-1} an={dau} onClick={() => cuon(-1)} />
      <NutCuon huong={1} an={cuoi} onClick={() => cuon(1)} />
    </div>
  );
}

function NutCuon({ huong, an, onClick }: { huong: 1 | -1; an: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={an ? -1 : 0}
      aria-hidden={an}
      aria-label={huong === 1 ? 'Xem album tiếp' : 'Xem album trước'}
      className={`absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-glass ring-1 ring-hairline backdrop-blur transition duration-300 hover:scale-105 hover:bg-surface sm:flex ${
        huong === 1 ? '-right-3' : '-left-3'
      } ${an ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={huong === 1 ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
      </svg>
    </button>
  );
}
