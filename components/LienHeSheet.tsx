'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import {
  trackCallClick,
  trackMessengerClick,
  trackZaloClick,
  type ViTri,
} from '@/lib/analytics';

/**
 * Bảng "Nhắn tiệm qua…" — khách TỰ CHỌN Zalo / Messenger / Gọi (chủ shop chốt
 * 13/11/2026, thay cho việc mỗi chỗ một kênh: trang chi tiết Messenger, nút nổi
 * Zalo…).
 *
 * Mở từ bất kỳ đâu bằng `moLienHe({...})` — một sự kiện trên window, nên nút
 * mở có thể nằm trong server component con (qua NutLienHe) mà không cần
 * Context bọc cả trang. Component này gắn MỘT lần trong app/layout.tsx.
 *
 * Tin nhắn soạn sẵn được chép vào bộ nhớ tạm khi khách bấm kênh: Zalo không cho
 * điền sẵn nội dung qua link, nên khách mở chat rồi chỉ việc dán.
 */

export interface YeuCauLienHe {
  /** Tin nhắn soạn sẵn. Bỏ trống -> câu chào chung. */
  tinNhan?: string;
  viTri: ViTri;
  maSp?: string | null;
}

const SU_KIEN = 'sherent:lien-he';

export function moLienHe(yc: YeuCauLienHe) {
  window.dispatchEvent(new CustomEvent<YeuCauLienHe>(SU_KIEN, { detail: yc }));
}

const CAU_CHAO = `Chào ${siteConfig.name}, mình muốn được tư vấn thuê đồ ạ.`;

export function LienHeSheet() {
  const [yc, setYc] = useState<YeuCauLienHe | null>(null);
  const [dangDong, setDangDong] = useState(false);
  const [daChep, setDaChep] = useState(false);
  const dongRef = useRef<HTMLButtonElement>(null);
  const bangRef = useRef<HTMLDivElement>(null);
  const hen = useRef<ReturnType<typeof setTimeout>>();
  // Vuốt xuống để đóng (điện thoại): toạ độ lúc chạm và quãng đã kéo.
  const keo = useRef<{ y0: number; dy: number } | null>(null);

  useEffect(() => {
    const mo = (e: Event) => {
      clearTimeout(hen.current);
      setDangDong(false);
      setDaChep(false);
      setYc((e as CustomEvent<YeuCauLienHe>).detail);
    };
    window.addEventListener(SU_KIEN, mo);
    return () => {
      window.removeEventListener(SU_KIEN, mo);
      clearTimeout(hen.current);
    };
  }, []);

  // Đóng có hiệu ứng: chạy hoạt ảnh "ra" rồi mới gỡ khỏi trang.
  const dong = useCallback(() => {
    setDangDong(true);
    clearTimeout(hen.current);
    hen.current = setTimeout(() => {
      setYc(null);
      setDangDong(false);
    }, 220);
  }, []);

  const batDauKeo = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    keo.current = { y0: e.clientY, dy: 0 };
  };
  const dangKeo = (e: React.PointerEvent) => {
    const k = keo.current;
    const el = bangRef.current;
    if (!k || !el) return;
    k.dy = Math.max(0, e.clientY - k.y0);
    el.style.transition = 'none';
    el.style.transform = `translateY(${k.dy}px)`;
  };
  const thaKeo = () => {
    const k = keo.current;
    const el = bangRef.current;
    keo.current = null;
    if (!k || !el) return;
    if (k.dy > 80) {
      // Đóng tiếp từ đúng chỗ đang kéo (biến --keo dùng trong keyframe).
      el.style.setProperty('--keo', `${k.dy}px`);
      el.style.transform = '';
      dong();
    } else {
      el.style.transition = 'transform 200ms cubic-bezier(0.2, 0.9, 0.25, 1)';
      el.style.transform = '';
    }
  };

  // Esc để đóng, khoá cuộn trang nền, đưa focus vào bảng.
  useEffect(() => {
    if (!yc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dong();
    };
    document.addEventListener('keydown', onKey);
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dongRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = cu;
    };
  }, [yc, dong]);

  if (!yc) return null;

  const tinNhan = yc.tinNhan || CAU_CHAO;

  const chep = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(tinNhan).then(
      () => setDaChep(true),
      () => {},
    );
  };

  const kenhClass =
    'nhan-co flex h-14 w-full items-center gap-3 rounded-2xl px-4 text-left text-[15px] font-bold';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Đóng"
        tabIndex={-1}
        onClick={dong}
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] ${dangDong ? 'nen-mo-ra' : 'nen-mo-vao'}`}
      />
      <div
        ref={bangRef}
        onPointerDown={batDauKeo}
        onPointerMove={dangKeo}
        onPointerUp={thaKeo}
        onPointerCancel={thaKeo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lien-he-tieu-de"
        className={`${dangDong ? 'bang-ra' : 'bang-vao'} relative w-full max-w-md touch-pan-x rounded-t-3xl bg-surface px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-glass-lg sm:rounded-3xl sm:pb-5`}
      >
        <div aria-hidden="true" className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-hairline sm:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="lien-he-tieu-de" className="text-lg text-ink">
              Nhắn tiệm qua
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Tin nhắn dưới đây sẽ được sao chép — mở chat rồi dán và gửi.
            </p>
          </div>
          <button
            ref={dongRef}
            type="button"
            onClick={dong}
            aria-label="Đóng bảng liên hệ"
            className="-mr-1 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-tint/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <p className="mt-3 whitespace-pre-line rounded-2xl bg-bg p-3 text-sm leading-relaxed text-ink">
          {tinNhan}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={siteConfig.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              chep();
              trackZaloClick(yc.viTri, yc.maSp);
            }}
            className={`${kenhClass} bg-[#0068FF] text-white`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-extrabold">
              Zalo
            </span>
            Nhắn Zalo
          </a>
          <a
            href={siteConfig.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              chep();
              trackMessengerClick(yc.viTri, yc.maSp);
            }}
            className={`${kenhClass} bg-ink text-white`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2.5c-5.3 0-9.5 3.9-9.5 9 0 2.8 1.3 5.3 3.5 7v3.3l3.2-1.8c.9.3 1.8.4 2.8.4 5.3 0 9.5-3.9 9.5-9s-4.2-8.9-9.5-8.9z" />
                <path d="m7 13.5 3.2-3.4 2.4 2.3 3.4-3.4-3.2 3.4-2.4-2.3z" />
              </svg>
            </span>
            Nhắn Messenger
          </a>
          <a
            href={`tel:${siteConfig.phone.tel}`}
            onClick={() => trackCallClick(yc.viTri)}
            className={`${kenhClass} bg-white text-ink ring-1 ring-inset ring-hairline`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tint text-accent-dark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
            </span>
            {/* Hotline dành cho khiếu nại / phản ánh (chủ shop 13/11/2026). */}
            <span className="flex min-w-0 flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-1.5">
              <span>Gọi {siteConfig.phone.display}</span>
              <span className="text-xs font-medium text-muted">(Khiếu nại, Phản ánh)</span>
            </span>
          </a>
        </div>

        <p aria-live="polite" className="mt-3 min-h-5 text-center text-xs font-semibold text-accent-dark">
          {daChep ? 'Đã sao chép tin nhắn — dán vào khung chat nhé!' : ''}
        </p>
      </div>
    </div>
  );
}

/**
 * Nút mở bảng liên hệ — dùng được trong server component (chỉ truyền dữ liệu
 * thuần, không truyền hàm).
 */
export function NutLienHe({
  className,
  children,
  ...yc
}: YeuCauLienHe & { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => moLienHe(yc)}>
      {children}
    </button>
  );
}
