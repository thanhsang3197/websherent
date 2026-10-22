'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { trackUuDaiClick } from '@/lib/analytics';

/** Đổi sang chương trình kế tiếp sau ít nhất từng này mili-giây. */
const DOI_SAU_MS = 5000;

/** Tốc độ chữ chạy khi tiêu đề dài hơn thanh (px mỗi giây). */
const TOC_DO_CHAY = 40;

export interface PromoBarItem {
  id: string;
  /** Mã loại chương trình (VOUCHER, GUI_ANH…). */
  loai: string;
  tieuDe: string;
  loaiTen: string;
}

/**
 * Thanh thông báo mỏng ngay dưới Header trên MỌI trang: khách vào từ link sản phẩm cũng
 * thấy ưu đãi, không chỉ khách vào trang chủ.
 *
 * - Có nhiều chương trình thì tự xoay vòng; dừng khi rê chuột / chạm vào, và
 *   không tự xoay nếu khách bật "giảm chuyển động".
 * - Tiêu đề dài hơn thanh (hay gặp trên điện thoại) thì chữ chạy ngang thay vì
 *   bị cắt "…"; đang chạy thì chờ chạy hết một vòng mới đổi chương trình.
 * - Dính ngay dưới Header khi cuộn (bọc chung trong app/layout.tsx) để
 *   khách luôn thấy.
 * - Không có nút tắt: shop muốn thanh luôn hiện với mọi khách.
 */
export function PromoBar({ items }: { items: PromoBarItem[] }) {
  const [chiSo, setChiSo] = useState(0);
  const [tamDung, setTamDung] = useState(false);
  const [giamChuyenDong, setGiamChuyenDong] = useState(false);
  // Thời gian một vòng chữ chạy của chương trình đang hiện (0 = không chạy).
  const [vongChayMs, setVongChayMs] = useState(0);

  useEffect(() => {
    setGiamChuyenDong(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const hien = items;
  const soCt = hien.length;

  useEffect(() => {
    if (soCt < 2 || tamDung || giamChuyenDong) return;
    const t = window.setTimeout(
      () => setChiSo((i) => (i + 1) % soCt),
      Math.max(DOI_SAU_MS, vongChayMs),
    );
    return () => window.clearTimeout(t);
  }, [chiSo, soCt, tamDung, giamChuyenDong, vongChayMs]);

  if (soCt === 0) return null;

  // `chiSo` có thể vượt số chương trình khi danh sách ưu đãi đổi.
  const cur = hien[chiSo % soCt];

  const doi = (buoc: number) => setChiSo((i) => (((i % soCt) + buoc) % soCt + soCt) % soCt);

  return (
    <div
      role="region"
      aria-label="Ưu đãi"
      className="bg-accent-dark text-surface"
      onMouseEnter={() => setTamDung(true)}
      onMouseLeave={() => setTamDung(false)}
      onFocus={() => setTamDung(true)}
      onBlur={() => setTamDung(false)}
      onTouchStart={() => setTamDung(true)}
    >
      <div className="container-content flex min-h-9 items-center gap-1 text-[13px] sm:min-h-10 sm:text-sm">
        {soCt > 1 && <NutDoi huong="truoc" onClick={() => doi(-1)} />}

        <Link
          href={`/uu-dai#${cur.id}`}
          onClick={() => trackUuDaiClick('thanh', cur.tieuDe)}
          className="group mx-auto flex min-w-0 flex-1 items-center justify-center gap-3 py-2 sm:flex-initial"
        >
          {/* Loại chương trình chỉ hiện từ sm: điện thoại cần chỗ cho tiêu đề hơn. */}
          {/* Bỏ nhãn khi tiêu đề đã mở đầu bằng chính nó ("Ưu đãi Ưu đãi Hạng…"). */}
          {!cur.tieuDe.toLowerCase().startsWith(cur.loaiTen.toLowerCase()) && (
            <span className="hidden shrink-0 text-surface/70 sm:inline">{cur.loaiTen}</span>
          )}
          <ChuChay key={cur.id} choChay={!giamChuyenDong} tamDung={tamDung} onVongChay={setVongChayMs}>
            {cur.tieuDe}
          </ChuChay>
          <span className="hidden shrink-0 font-medium underline decoration-surface/40 underline-offset-4 transition group-hover:decoration-surface sm:inline">
            Xem chi tiết
          </span>
        </Link>

        {soCt > 1 && <NutDoi huong="sau" onClick={() => doi(1)} />}
      </div>
    </div>
  );
}

/** Nút ‹ › đổi chương trình bằng tay; đủ rộng cho ngón cái dù thanh thấp. */
function NutDoi({ huong, onClick }: { huong: 'truoc' | 'sau'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={huong === 'truoc' ? 'Ưu đãi trước' : 'Ưu đãi sau'}
      className="-mx-2 flex h-9 w-10 shrink-0 items-center justify-center text-surface/75 transition hover:text-surface active:scale-90 sm:h-10"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={huong === 'truoc' ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'} />
      </svg>
    </button>
  );
}

/** Khoảng trống giữa hai bản chữ nối đuôi khi chạy (khớp `pr-12`). */
const KHOANG_NOI = 48;

/**
 * Một dòng chữ: vừa chỗ thì đứng yên; dài hơn chỗ thì chạy ngang liên tục
 * (hai bản nối đuôi, trượt đúng một bản rồi lặp lại cho liền mạch). Không được
 * chạy (khách bật "giảm chuyển động") thì cắt "…" như cũ.
 */
function ChuChay({
  children,
  choChay,
  tamDung,
  onVongChay,
}: {
  children: ReactNode;
  choChay: boolean;
  tamDung: boolean;
  onVongChay: (ms: number) => void;
}) {
  const khungRef = useRef<HTMLSpanElement>(null);
  const chuRef = useRef<HTMLSpanElement>(null);
  // Bề rộng một bản chữ kể cả khoảng nối; 0 = vừa chỗ, không chạy.
  const [rongChay, setRongChay] = useState(0);
  const dangChay = choChay && rongChay > 0;

  useEffect(() => {
    const khung = khungRef.current;
    const chu = chuRef.current;
    if (!khung || !chu || !choChay) return;
    const do_ = () => {
      // Đang chạy thì bản chữ có thêm khoảng nối — trừ ra khi so với khung.
      const rongChu = chu.offsetWidth - (chu.dataset.chay ? KHOANG_NOI : 0);
      const tran = rongChu > khung.clientWidth + 1;
      setRongChay(tran ? rongChu + KHOANG_NOI : 0);
    };
    do_();
    const ro = new ResizeObserver(do_);
    ro.observe(khung);
    return () => ro.disconnect();
  }, [choChay]);

  const vongMs = dangChay ? Math.round((rongChay / TOC_DO_CHAY) * 1000) : 0;
  useEffect(() => {
    onVongChay(vongMs);
  }, [vongMs, onVongChay]);

  return (
    <span
      ref={khungRef}
      className={`uu-dai-doi min-w-0 font-medium ${dangChay ? 'flex-1 overflow-hidden' : 'truncate'}`}
    >
      <span
        className={dangChay ? 'chu-chay flex w-max' : ''}
        style={
          dangChay
            ? ({
                '--chu-chay-xa': `-${rongChay}px`,
                animationDuration: `${vongMs}ms`,
                animationPlayState: tamDung ? 'paused' : 'running',
              } as CSSProperties)
            : undefined
        }
      >
        <span
          ref={chuRef}
          data-chay={dangChay ? '1' : undefined}
          className={dangChay ? 'whitespace-nowrap pr-12' : ''}
        >
          {children}
        </span>
        {/* Bản nối đuôi cho vòng chạy liền mạch; đọc màn hình bỏ qua. */}
        {dangChay && (
          <span aria-hidden="true" className="whitespace-nowrap pr-12">
            {children}
          </span>
        )}
      </span>
    </span>
  );
}
