'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

/**
 * Gallery ảnh sản phẩm: khung vòm (arch), KÉO NGANG để đổi ảnh.
 * Nhiều ảnh -> hiện dãy chấm trắng ở đáy ảnh, vừa báo "còn ảnh nữa" vừa bấm
 * được để nhảy thẳng tới ảnh đó. 1 ảnh -> chỉ hiện ảnh. 0 ảnh -> khung monogram.
 *
 * Dùng scroll-snap sẵn có của trình duyệt thay vì tự bắt cử chỉ: vuốt trên
 * điện thoại, kéo trackpad trên desktop và phím mũi tên đều chạy mà không tốn
 * dòng JS nào.
 *
 * KHÔNG có dải thumbnail và KHÔNG có lightbox phóng to (gỡ 28/08/2026): hai
 * thứ đó ép Vercel gia công thêm cỡ 96px và 1920px cho mỗi tấm — hai cỡ đắt
 * nhất mà ít người xem nhất, và là thủ phạm chính làm cạn hạn mức Image
 * Transformations. Giờ mọi vị trí chỉ còn xài 384/640/1080.
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

  // Chấm bám theo vị trí cuộn thật, nên vuốt tay và bấm chấm luôn khớp nhau.
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

  return (
    <div className="w-full max-w-sm">
      <div className="relative">
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
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                  {images.map((src, i) => (
                    <button
                      key={`dot-${src}-${i}`}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Xem ảnh ${i + 1}`}
                      aria-current={i === active}
                      className={`pointer-events-auto h-2 w-2 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition ${
                        i === active
                          ? 'bg-white'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
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
    </div>
  );
}
