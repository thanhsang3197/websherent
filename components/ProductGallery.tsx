'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

/**
 * Gallery ảnh sản phẩm: khung vòm (arch), KÉO NGANG để đổi ảnh.
 * Nhiều ảnh -> hiện nút mũi tên ở mép trái/phải để bấm qua lại, kèm DẢI ẢNH
 * NHỎ (thumbnail) để khách thấy ngay mẫu có mấy hình và bấm nhảy thẳng tới:
 *   - từ `sm` trở lên: cột dọc bên TRÁI ảnh lớn, cao đúng bằng ảnh lớn
 *     (nhiều ảnh thì tự cuộn dọc).
 *   - điện thoại: hàng ngang NGAY DƯỚI ảnh — màn hẹp, đặt bên trái sẽ bóp nhỏ
 *     ảnh chính.
 * 1 ảnh -> chỉ hiện ảnh. 0 ảnh -> khung monogram.
 *
 * Dùng scroll-snap sẵn có của trình duyệt thay vì tự bắt cử chỉ: vuốt trên
 * điện thoại, kéo trackpad trên desktop và phím mũi tên đều chạy mà không tốn
 * dòng JS nào.
 *
 * VỀ QUOTA ẢNH VERCEL: dải thumbnail cũ bị gỡ 28/08/2026 vì bắt Vercel gia công
 * thêm cỡ 96px (xem next.config.js). Dải mới KHÔNG thêm cỡ nào: config giờ chỉ
 * còn 384/640/1080, nên thumbnail 56-64px tự rơi vào cỡ 384 — đúng cỡ mà ô lưới
 * sản phẩm ở trang chủ đã dùng, file đã có sẵn trong cache. Đừng thêm lại 96
 * vào `imageSizes` chỉ để thumbnail "nhẹ hơn".
 * Lightbox phóng to vẫn KHÔNG có (cần cỡ 1920).
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const hasMultiple = images.length > 1;

  // Thumbnail đang chọn bám theo vị trí cuộn thật, nên vuốt tay và bấm
  // thumbnail luôn khớp nhau.
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive((prev) => (prev === i ? prev : i));
  }, []);

  const goTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }, []);

  /**
   * Lùi/tiến 1 ảnh, CUỘN VÒNG: ở ảnh cuối bấm tiếp thì quay về ảnh đầu.
   * Phần lớn mẫu chỉ có 2 ảnh — khoá nút ở hai đầu sẽ khiến nút trông như hỏng.
   */
  const step = useCallback(
    (delta: number) => {
      const n = images.length;
      if (n < 2) return;
      goTo((active + delta + n) % n);
    },
    [active, goTo, images.length],
  );

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-[460px] sm:flex-row-reverse">
      <div className="relative min-w-0 flex-1">
        <div
          aria-hidden="true"
          className="arch absolute -right-3 -top-3 h-full w-full border border-accent/40"
        />
        <div className="arch relative aspect-[3/4] w-full overflow-hidden bg-tint">
          {images.length > 0 ? (
            <>
              <div
                ref={trackRef}
                onScroll={onScroll}
                tabIndex={hasMultiple ? 0 : undefined}
                role={hasMultiple ? 'group' : undefined}
                aria-label={
                  hasMultiple
                    ? `${alt} — ${images.length} ảnh, kéo ngang để xem`
                    : undefined
                }
                className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
              >
                {images.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative h-full w-full shrink-0 snap-center"
                  >
                    <Image
                      src={src}
                      alt={i === 0 ? alt : `${alt} — ảnh ${i + 1}`}
                      fill
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL={GLASS_BLUR_DATA_URL}
                      sizes="(max-width: 1024px) 90vw, 384px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {hasMultiple && (
                <>
                  <ArrowButton
                    side="left"
                    label="Ảnh trước"
                    onClick={() => step(-1)}
                  />
                  <ArrowButton
                    side="right"
                    label="Ảnh kế"
                    onClick={() => step(1)}
                  />
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-tint">
              <span className="font-serif text-6xl text-accent/45">
                {siteConfig.name.charAt(0)}
              </span>
              <span className="text-xs text-muted">Ảnh đang cập nhật</span>
            </div>
          )}
        </div>
      </div>

      {hasMultiple && (
        // Cột ngoài `relative` + lớp trong `absolute inset-0` (từ sm): cột lấy
        // chiều cao theo ảnh lớn bên cạnh chứ không tự đẩy cao thêm khi nhiều ảnh.
        <div className="relative shrink-0 sm:w-16">
          <div className="no-scrollbar flex gap-2 overflow-x-auto sm:absolute sm:inset-0 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
            {images.map((src, i) => (
              <button
                key={`thumb-${src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === active}
                className={`relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-md border-2 bg-tint transition sm:w-full ${
                  i === active
                    ? 'border-accent-dark'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Nút mũi tên chồng lên mép trái/phải của ảnh.
 *
 * Mũi tên vẽ bằng inline SVG như các component khác trong repo (không kéo thêm
 * thư viện icon). Nền hơi mờ để còn thấy được ảnh phía dưới, đậm lên khi rê
 * chuột — trên điện thoại không có trạng thái hover nên để sẵn độ mờ đọc được.
 */
function ArrowButton({
  side,
  label,
  onClick,
}: {
  side: 'left' | 'right';
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-ink shadow-[0_1px_4px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:bg-white ${
        side === 'left' ? 'left-2' : 'right-2'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-4 w-4"
      >
        <polyline points={side === 'left' ? '15 5 8 12 15 19' : '9 5 16 12 9 19'} />
      </svg>
    </button>
  );
}
