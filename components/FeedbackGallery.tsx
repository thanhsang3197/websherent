'use client';

import { useMemo, useRef, useState } from 'react';
import type { Feedback } from '@/types/feedback';
import { FeedbackCard } from '@/components/FeedbackCard';
import { FeedbackLightbox } from '@/components/FeedbackLightbox';

/**
 * Danh sách thẻ feedback + hộp xem ảnh lớn. Hai cách bày:
 *
 *  - `dai`  : MỘT hàng vuốt ngang ở mọi cỡ màn hình, không xuống dòng (trang
 *             chủ — chủ shop 04/10/2026). Máy tính có thêm nút ‹ ›.
 *  - `so-le`: lưới so le kiểu Pinterest (trang Feedback, trang chi tiết sản
 *             phẩm), vẫn đọc trái→phải đúng thứ tự API — xem `LuoiSoLe`.
 *             `locTheoDip` bật hàng nút lọc theo dịp.
 */
export function FeedbackGallery({
  feedback,
  kieu = 'so-le',
  locTheoDip = false,
}: {
  feedback: Feedback[];
  kieu?: 'dai' | 'so-le';
  locTheoDip?: boolean;
}) {
  const [dangMo, setDangMo] = useState<Feedback | null>(null);
  const [dip, setDip] = useState<string | null>(null);

  // Chỉ hiện nút cho dịp THẬT SỰ có feedback — nút bấm vào ra trang trống là
  // nói dối khách.
  const cacDip = useMemo(() => {
    const m = new Map<string, string>();
    for (const f of feedback) if (f.dip && f.dipTen) m.set(f.dip, f.dipTen);
    return Array.from(m, ([ma, ten]) => ({ ma, ten }));
  }, [feedback]);

  const ds = dip ? feedback.filter((f) => f.dip === dip) : feedback;

  return (
    <>
      {locTheoDip && cacDip.length > 1 && (
        <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          <NutLoc chon={dip === null} onClick={() => setDip(null)}>
            Tất cả
          </NutLoc>
          {cacDip.map((d) => (
            <NutLoc key={d.ma} chon={dip === d.ma} onClick={() => setDip(d.ma)}>
              {d.ten}
            </NutLoc>
          ))}
        </div>
      )}

      {kieu === 'dai' ? (
        <DaiNgang ds={ds} onMo={setDangMo} />
      ) : (
        <LuoiSoLe ds={ds} onMo={setDangMo} />
      )}

      {dangMo && <FeedbackLightbox fb={dangMo} onDong={() => setDangMo(null)} />}
    </>
  );
}

function NutLoc({
  chon,
  onClick,
  children,
}: {
  chon: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={chon}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
        chon
          ? 'border-accent-dark bg-accent-dark text-surface'
          : 'border-hairline bg-surface text-ink hover:border-accent/50'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Các khung cho lưới so le — viết NGUYÊN VĂN để Tailwind JIT sinh lớp. Không
 * có khung vuông: story ghép nhiều ảnh nhỏ cắt vuông là mất nửa nội dung.
 */
const TI_LE = ['aspect-[9/16]', 'aspect-[3/4]', 'aspect-[2/3]', 'aspect-[4/5]'] as const;

/** Khung của thẻ thứ i — cố định theo vị trí, đổi nhịp mỗi 4 thẻ để hai thẻ cạnh nhau ít khi trùng. */
function tiLe(i: number): string {
  return TI_LE[(i * 3 + Math.floor(i / 4)) % TI_LE.length];
}

/** Chia thẻ LẦN LƯỢT vào n cột: thẻ 0 cột 1, thẻ 1 cột 2… -> hàng trên cùng vẫn là mới nhất. */
function chiaCot<T>(ds: T[], n: number): { item: T; i: number }[][] {
  const cot = Array.from({ length: n }, () => [] as { item: T; i: number }[]);
  ds.forEach((item, i) => cot[i % n].push({ item, i }));
  return cot;
}

/**
 * Lưới so le kiểu Pinterest mà GIỮ thứ tự theo hàng.
 *
 * Dựng sẵn bố cục 2 / 3 / 4 cột và để CSS chọn theo bề rộng màn hình — không
 * đo bằng JS, nên không có cú nhảy bố cục lúc tải trang. Bản đang ẩn
 * (`display:none`) không tải ảnh vì next/image để `loading="lazy"`.
 */
function LuoiSoLe({ ds, onMo }: { ds: Feedback[]; onMo: (fb: Feedback) => void }) {
  const bo = [
    { n: 2, lop: 'flex sm:hidden' },
    { n: 3, lop: 'hidden sm:flex lg:hidden' },
    { n: 4, lop: 'hidden lg:flex' },
  ];
  return (
    <>
      {bo.map(({ n, lop }) => (
        <div key={n} className={`${lop} items-start gap-3 sm:gap-4`}>
          {chiaCot(ds, n).map((cot, c) => (
            <ul key={c} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
              {cot.map(({ item: fb, i }) => (
                <li key={fb.id}>
                  <FeedbackCard fb={fb} kieu="cat" tiLe={tiLe(i)} onMo={() => onMo(fb)} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </>
  );
}

/**
 * Dải ngang ở trang chủ: luôn một hàng, vuốt / cuộn ngang. Thẻ cuối lộ một
 * phần để khách biết còn nữa. Máy tính không vuốt được bằng chuột nên có nút
 * ‹ › cuộn đúng một khung nhìn.
 */
function DaiNgang({ ds, onMo }: { ds: Feedback[]; onMo: (fb: Feedback) => void }) {
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
  const cuon = (huong: 1 | -1) => {
    const el = dai.current;
    if (el) el.scrollBy({ left: huong * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <ul
        ref={dai}
        onScroll={doViTri}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:gap-4 sm:scroll-px-0 sm:px-0"
      >
        {ds.map((fb) => (
          <li
            key={fb.id}
            className="w-[62vw] shrink-0 snap-start sm:w-[calc((100%-2rem)/3.3)] lg:w-[calc((100%-3rem)/4.3)]"
          >
            <FeedbackCard
              fb={fb}
              kieu="dai"
              onMo={() => onMo(fb)}
              sizes="(max-width: 640px) 62vw, (max-width: 1024px) 30vw, 23vw"
            />
          </li>
        ))}
      </ul>
      {ds.length > 3 && (
        <>
          {!dau && <NutCuon huong={-1} onClick={() => cuon(-1)} />}
          {!cuoi && <NutCuon huong={1} onClick={() => cuon(1)} />}
        </>
      )}
    </div>
  );
}

function NutCuon({ huong, onClick }: { huong: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={huong === 1 ? 'Xem feedback tiếp' : 'Xem feedback trước'}
      className={`absolute top-[40%] hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-glass ring-1 ring-hairline backdrop-blur transition hover:bg-surface sm:flex ${
        huong === 1 ? '-right-3' : '-left-3'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={huong === 1 ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
      </svg>
    </button>
  );
}
