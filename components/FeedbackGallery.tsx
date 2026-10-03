'use client';

import { useMemo, useState } from 'react';
import type { Feedback } from '@/types/feedback';
import { FeedbackCard } from '@/components/FeedbackCard';
import { FeedbackLightbox } from '@/components/FeedbackLightbox';

/**
 * Danh sách thẻ feedback + hộp xem ảnh lớn. Hai cách bày:
 *
 *  - `dai`  : một hàng vuốt ngang trên điện thoại, lưới 4 cột trên máy tính
 *             (trang chủ — giống khối Album, không đẩy bộ sưu tập xuống xa).
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
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {ds.map((fb) => (
            <li key={fb.id} className="w-[62vw] shrink-0 snap-start sm:w-auto">
              <FeedbackCard
                fb={fb}
                kieu="dai"
                onMo={() => setDangMo(fb)}
                sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 25vw"
              />
            </li>
          ))}
        </ul>
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
