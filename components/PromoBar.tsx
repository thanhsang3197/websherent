'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { kieuLoai } from '@/lib/uu-dai';

/** Đổi sang chương trình kế tiếp sau ít nhất từng này mili-giây. */
const DOI_SAU_MS = 5000;

/** Tốc độ chữ chạy khi tiêu đề dài hơn thanh (px mỗi giây). */
const TOC_DO_CHAY = 40;

export interface PromoBarItem {
  id: string;
  /** Mã loại — chọn biểu tượng đứng trước tiêu đề. */
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
      <div className="container-content flex min-h-9 items-center gap-2 text-[13px] sm:text-sm">
        <Link
          href={`/uu-dai#${cur.id}`}
          className="flex min-w-0 flex-1 items-center gap-2 py-1.5 hover:underline"
        >
          {/* Nhãn loại chỉ hiện từ sm: điện thoại cần chỗ cho tiêu đề hơn. */}
          <span className="hidden shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide sm:inline">
            {cur.loaiTen}
          </span>
          <ChuChay
            key={cur.id}
            choChay={!giamChuyenDong}
            tamDung={tamDung}
            onVongChay={setVongChayMs}
          >
            {/* Biểu tượng hiện cả trên điện thoại, nơi nhãn chữ bị ẩn. */}
            <span aria-hidden="true">{kieuLoai(cur.loai).icon} </span>
            {cur.tieuDe}
          </ChuChay>
          <span className="shrink-0 font-semibold">Xem →</span>
        </Link>

        {soCt > 1 && (
          <span className="flex shrink-0 gap-1" aria-hidden="true">
            {hien.map((i, n) => (
              <span
                key={i.id}
                className={`h-1.5 w-1.5 rounded-full ${
                  n === chiSo % soCt ? 'bg-surface' : 'bg-surface/40'
                }`}
              />
            ))}
          </span>
        )}
      </div>
    </div>
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
