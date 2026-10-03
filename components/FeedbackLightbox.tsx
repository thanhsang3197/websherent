'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Feedback } from '@/types/feedback';
import { TEN_AN_DANH, dongPhu } from '@/components/FeedbackCard';

/**
 * Hộp xem MỘT feedback: dải ảnh vuốt ngang, lời khách, tên, mẫu đã mặc, và
 * nút "Xem tin nhắn gốc" mở ảnh chụp chat — bằng chứng phụ cho khách nào muốn
 * kiểm tra (đặt sau một nút để ảnh chat không lấn át ảnh khách mặc đồ).
 *
 * Đóng bằng Esc, nút ✕, hoặc bấm ra nền tối.
 */
export function FeedbackLightbox({ fb, onDong }: { fb: Feedback; onDong: () => void }) {
  const [xemChat, setXemChat] = useState(false);
  const [dangXem, setDangXem] = useState(0);
  const daiAnh = useRef<HTMLDivElement>(null);
  const nutDong = useRef<HTMLButtonElement>(null);

  const ten = fb.tenHienThi ?? TEN_AN_DANH;
  const phu = dongPhu(fb);
  const anh = xemChat ? fb.anhTinNhan : fb.anh;

  // Nơi gọi truyền hàm mới mỗi lần vẽ; giữ qua ref để effect bên dưới chỉ
  // chạy MỘT lần — chạy lại theo từng lần vẽ (vuốt ảnh là vẽ lại) thì focus
  // cứ bị kéo về nút đóng.
  const onDongRef = useRef(onDong);
  onDongRef.current = onDong;

  // Khoá cuộn trang phía sau + Esc để đóng + đưa focus vào hộp.
  useEffect(() => {
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nutDong.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDongRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = cu;
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Đổi giữa ảnh khách và ảnh chat thì quay về tấm đầu.
  useEffect(() => {
    setDangXem(0);
    daiAnh.current?.scrollTo({ left: 0 });
  }, [xemChat]);

  const cuon = (i: number) => {
    const el = daiAnh.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Feedback của ${ten}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onDong}
    >
      <div
        className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-surface shadow-glass-lg sm:rounded-3xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={nutDong}
          type="button"
          onClick={onDong}
          aria-label="Đóng"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-surface/85 text-ink shadow backdrop-blur hover:bg-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Dải ảnh — vuốt ngang trên điện thoại, nút ‹ › trên máy tính. */}
        <div className="relative min-h-0 bg-tint md:w-[58%]">
          <div
            ref={daiAnh}
            className="no-scrollbar flex h-[58dvh] snap-x snap-mandatory overflow-x-auto md:h-[80dvh]"
            onScroll={(e) => {
              const el = e.currentTarget;
              setDangXem(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
            }}
          >
            {anh.map((url, i) => (
              <div key={url} className="relative h-full w-full shrink-0 snap-center">
                <Image
                  src={url}
                  alt={
                    xemChat
                      ? `Tin nhắn của ${ten} (${i + 1}/${anh.length})`
                      : `${ten} — ảnh ${i + 1}/${anh.length}`
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-contain"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {anh.length > 1 && (
            <>
              <NutChuyen huong="trai" an={dangXem === 0} onClick={() => cuon(dangXem - 1)} />
              <NutChuyen
                huong="phai"
                an={dangXem >= anh.length - 1}
                onClick={() => cuon(dangXem + 1)}
              />
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {anh.map((url, i) => (
                  <span
                    key={url}
                    className={`h-1.5 rounded-full transition-all ${
                      i === dangXem ? 'w-5 bg-accent-dark' : 'w-1.5 bg-ink/25'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 sm:p-7">
          {fb.nangTho && (
            <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
              ✦ Nàng thơ của tháng
            </span>
          )}

          {fb.loiKhach && (
            <blockquote className="font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
              “{fb.loiKhach}”
            </blockquote>
          )}

          <div>
            <p className="font-semibold text-accent-dark">{ten}</p>
            {phu && <p className="mt-0.5 text-sm text-muted">{phu}</p>}
            {fb.instagram && (
              <a
                href={`https://www.instagram.com/${fb.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-accent-dark underline-offset-4 hover:underline"
              >
                @{fb.instagram}
              </a>
            )}
          </div>

          {fb.mau && (
            <Link
              href={`/san-pham/${fb.mau.slug}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-tint/60 px-4 py-3 text-sm transition-colors hover:border-accent/50"
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted">Mẫu khách đã mặc</span>
                <span className="block truncate font-medium text-ink">{fb.mau.ten}</span>
              </span>
              <span className="shrink-0 font-medium text-accent-dark">Xem mẫu →</span>
            </Link>
          )}

          {fb.anhTinNhan.length > 0 && (
            <button
              type="button"
              onClick={() => setXemChat((v) => !v)}
              className="btn btn-outline mt-auto w-full text-sm"
            >
              {xemChat ? '← Xem lại ảnh khách' : '💬 Xem tin nhắn gốc'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NutChuyen({
  huong,
  an,
  onClick,
}: {
  huong: 'trai' | 'phai';
  an: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={huong === 'trai' ? 'Ảnh trước' : 'Ảnh sau'}
      className={`absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink shadow backdrop-blur transition-opacity hover:bg-surface md:flex ${
        huong === 'trai' ? 'left-3' : 'right-3'
      } ${an ? 'pointer-events-none opacity-0' : ''}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={huong === 'trai' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
      </svg>
    </button>
  );
}
