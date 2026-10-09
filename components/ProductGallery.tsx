'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import type { ProductVideo } from '@/types/product';
import { trackVideoOpen } from '@/lib/analytics';

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
 * CÓ VIDEO (link Instagram/TikTok, xem lib/video.ts) -> dải ảnh nhỏ có thêm ô
 * ▶ ở cuối. Bấm vào thì khung Instagram/TikTok hiện THẲNG vào chỗ khung vòm
 * (không popup — chủ shop chọn 27/09/2026 để khách vẫn thấy giá và nút Đặt
 * lịch). iframe chỉ được tạo khi khách bấm ô ▶, nên khách không xem video thì
 * trang không tải thêm gì của Instagram/TikTok.
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
  video = null,
  maSp,
}: {
  images: string[];
  alt: string;
  video?: ProductVideo | null;
  /** Mã mẫu — gửi kèm sự kiện "Xem video". */
  maSp?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  // Chỉ ghi "Xem video" ở lần mở ĐẦU: bấm qua lại ảnh ↔ video không tính thêm.
  const daGhiVideo = useRef(false);
  const hasMultiple = images.length > 1;
  // Có video thì luôn hiện dải ảnh nhỏ, kể cả mẫu chỉ có 1 ảnh: ô ▶ nằm ở đó.
  const showStrip = hasMultiple || video != null;

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
   * Bấm ảnh nhỏ khi đang xem video: phải hiện lại khung ảnh TRƯỚC rồi mới cuộn.
   * Lúc khung còn `hidden` thì clientWidth = 0 và lệnh cuộn không có tác dụng.
   */
  const pickImage = useCallback(
    (i: number) => {
      if (!showVideo) return goTo(i);
      setShowVideo(false);
      setActive(i);
      requestAnimationFrame(() => {
        const el = trackRef.current;
        if (el) el.scrollLeft = i * el.clientWidth;
      });
    },
    [goTo, showVideo],
  );

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
        {video && showVideo && (
          <VideoFrame video={video} title={`${alt} — video`} />
        )}
        {/* Ẩn chứ không gỡ khung ảnh: giữ nguyên vị trí cuộn và ảnh đã tải. */}
        <div className={showVideo ? 'hidden' : 'relative'}>
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
      </div>

      {showStrip && (
        // Cột ngoài `relative` + lớp trong `absolute inset-0` (từ sm): cột lấy
        // chiều cao theo ảnh lớn bên cạnh chứ không tự đẩy cao thêm khi nhiều ảnh.
        <div className="relative shrink-0 sm:w-16">
          <div className="no-scrollbar flex gap-2 overflow-x-auto sm:absolute sm:inset-0 sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden">
            {images.map((src, i) => (
              <button
                key={`thumb-${src}-${i}`}
                type="button"
                onClick={() => pickImage(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={!showVideo && i === active}
                className={`relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-md border-2 bg-tint transition sm:w-full ${
                  !showVideo && i === active
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
            {video && (
              <button
                type="button"
                onClick={() => {
                  setShowVideo(true);
                  if (!daGhiVideo.current && maSp) {
                    daGhiVideo.current = true;
                    trackVideoOpen(maSp, video.kind);
                  }
                }}
                aria-label="Xem video"
                aria-current={showVideo}
                className={`relative flex aspect-[3/4] w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-accent-dark transition sm:w-full ${
                  showVideo
                    ? 'border-accent-dark'
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                {images[0] && (
                  <Image
                    src={images[0]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover brightness-75"
                  />
                )}
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="ml-0.5 h-3.5 w-3.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Khung video nhúng.
 *
 * Instagram: khung gồm thanh tên tài khoản + video + thanh "View more on
 * Instagram", cao thấp tuỳ tỉ lệ video. Trang nhúng của Instagram tự báo chiều
 * cao qua postMessage (`{type: 'MEASURE', details: {height}}` — đúng thứ mà
 * embed.js của họ nghe), nên nghe theo để khung vừa khít, không cắt, không thừa.
 * Không ẩn/cắt thanh tên tài khoản: đó là phần ghi nguồn của Instagram.
 *
 * TikTok: trình phát /player/v1 chỉ có video dọc 9:16, nên cố định tỉ lệ.
 */
function VideoFrame({ video, title }: { video: ProductVideo; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(620);

  useEffect(() => {
    if (video.kind !== 'instagram') return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://www.instagram.com') return;
      if (e.source !== frameRef.current?.contentWindow) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        const h = Number(data?.details?.height);
        if (data?.type === 'MEASURE' && h > 0) setHeight(Math.ceil(h));
      } catch {
        // Tin nhắn khác của Instagram, không phải JSON — bỏ qua.
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [video.kind]);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-white">
      <iframe
        ref={frameRef}
        src={video.embedUrl}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        scrolling="no"
        className={`block w-full ${video.kind === 'tiktok' ? 'aspect-[9/16]' : ''}`}
        style={video.kind === 'instagram' ? { height } : undefined}
      />
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
