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
 *  - `luoi` : lưới so le kiểu Pinterest, ảnh giữ tỉ lệ gốc (trang Feedback,
 *             trang chi tiết sản phẩm). `locTheoDip` bật hàng nút lọc theo dịp.
 */
export function FeedbackGallery({
  feedback,
  kieu = 'luoi',
  locTheoDip = false,
}: {
  feedback: Feedback[];
  kieu?: 'dai' | 'luoi';
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
        // CSS columns cho lưới so le: không cần thư viện, không cần đo ảnh.
        <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {ds.map((fb) => (
            <li key={fb.id} className="mb-3 break-inside-avoid sm:mb-4">
              <FeedbackCard fb={fb} onMo={() => setDangMo(fb)} />
            </li>
          ))}
        </ul>
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
