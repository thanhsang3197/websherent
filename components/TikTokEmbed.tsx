'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    tiktokEmbed?: { lib?: { render?: (els: Element[]) => void } };
  }
}

const EMBED_SCRIPT_SRC = 'https://www.tiktok.com/embed.js';

/**
 * Nhúng video TikTok. Cần `videoId` (tra qua oEmbed ở server, xem lib/tiktok.ts) —
 * embed.js KHÔNG tự đọc được ID chỉ từ `cite` (đã kiểm chứng: video ID ra "null"
 * nếu thiếu data-video-id). Không tra được ID -> hiện link mở TikTok thay vì
 * nhúng video lỗi.
 */
export function TikTokEmbed({ url, videoId }: { url: string; videoId: string | null }) {
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    if (!videoId) return;
    const existing = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`);
    if (existing) {
      // Script đã tải từ lần điều hướng trước (SPA) -> yêu cầu TikTok quét lại DOM.
      if (ref.current) window.tiktokEmbed?.lib?.render?.([ref.current]);
    } else {
      const script = document.createElement('script');
      script.src = EMBED_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="mx-auto max-w-sm rounded-2xl border border-hairline bg-surface p-5 text-center">
        <p className="text-sm text-muted">Xem video trên TikTok:</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline mt-3 inline-flex"
        >
          Mở TikTok
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto flex justify-center">
      <blockquote
        ref={ref}
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: 605, minWidth: 325, width: '100%' }}
      >
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Xem video trên TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}
