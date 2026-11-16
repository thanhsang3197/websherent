'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  CATEGORIES,
  SORT_OPTIONS,
  SelectField,
  CloseIcon,
  type Filters,
  type SortOption,
} from '@/components/ProductFilters';

/**
 * Thanh lọc GỌN bám dưới đầu trang khi khách đã cuộn qua khung lọc lớn và đang
 * xem lưới mẫu (chủ shop chọn 17/11/2026):
 *  - 1 hàng: nút tìm (cuộn về ô tìm) + loại đồ vuốt ngang + nút "Lọc".
 *  - Cuộn XUỐNG thì trượt ẩn cho rộng chỗ xem mẫu, cuộn NGƯỢC lên là hiện lại.
 *  - Điện thoại: "Lọc" mở bảng từ dưới lên (Size / Thương hiệu / Giá / Sắp xếp).
 *    Máy tính (lg): 4 ô chọn hiện sẵn ngay trên thanh, không cần bảng.
 *  - Đổi bộ lọc từ thanh -> cuộn về đầu lưới, kẻo danh sách ngắn lại mà khách
 *    vẫn đứng giữa chừng, nhìn thấy khoảng trống.
 *
 * KHÔNG hiện số mẫu ở đâu cả (chủ shop chốt 17/09/2026, xem ProductFilters).
 */
export function ThanhLocBam({
  filters,
  brands,
  sizes,
  priceBuckets,
  onChange,
  onReset,
  khungRef,
  vungRef,
  luoiRef,
}: {
  filters: Filters;
  brands: string[];
  sizes: string[];
  priceBuckets: readonly { id: string; label: string }[];
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  /** Khung lọc lớn — thanh chỉ hiện khi khung này đã khuất phía trên. */
  khungRef: RefObject<HTMLElement>;
  /** Cả vùng bộ sưu tập — ra khỏi vùng này (xuống tới feedback/footer) thì ẩn. */
  vungRef: RefObject<HTMLElement>;
  /** Đầu lưới mẫu — chỗ cuộn về sau khi đổi lọc. */
  luoiRef: RefObject<HTMLElement>;
}) {
  const [trongVung, setTrongVung] = useState(false);
  const [cuonLen, setCuonLen] = useState(false);
  const [moBang, setMoBang] = useState(false);
  const [dinh, setDinh] = useState(0);

  const yTruoc = useRef(0);
  useEffect(() => {
    const dauTrang = document.getElementById('dau-trang-dinh');
    const capNhat = () => {
      const top = dauTrang?.getBoundingClientRect().bottom ?? 0;
      setDinh(top);
      const khung = khungRef.current?.getBoundingClientRect();
      const vung = vungRef.current?.getBoundingClientRect();
      setTrongVung(Boolean(khung && vung && khung.bottom < top && vung.bottom > top + 240));

      const y = window.scrollY;
      // Ngưỡng 8px để rung tay / quán tính nhỏ không làm thanh nhấp nháy.
      if (y < yTruoc.current - 8) setCuonLen(true);
      else if (y > yTruoc.current + 8) setCuonLen(false);
      if (Math.abs(y - yTruoc.current) > 8) yTruoc.current = y;
    };
    capNhat();
    window.addEventListener('scroll', capNhat, { passive: true });
    window.addEventListener('resize', capNhat);
    return () => {
      window.removeEventListener('scroll', capNhat);
      window.removeEventListener('resize', capNhat);
    };
  }, [khungRef, vungRef]);

  // Bảng lọc mở: khoá cuộn trang nền, Esc để đóng.
  useEffect(() => {
    if (!moBang) return;
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoBang(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = cu;
      window.removeEventListener('keydown', onKey);
    };
  }, [moBang]);

  const veDauLuoi = useCallback(() => {
    const luoi = luoiRef.current;
    if (!luoi) return;
    // Trừ chiều cao đầu trang + thanh này (~56px) để mẫu đầu không bị che.
    const y = luoi.getBoundingClientRect().top + window.scrollY - dinh - 64;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, [luoiRef, dinh]);

  const doiLoc = (patch: Partial<Filters>) => {
    onChange(patch);
    requestAnimationFrame(veDauLuoi);
  };

  const veOTim = () => {
    const khung = khungRef.current;
    if (!khung) return;
    window.scrollTo({
      top: khung.getBoundingClientRect().top + window.scrollY - dinh - 12,
      behavior: 'smooth',
    });
    // Chờ cuộn xong rồi mới focus, kẻo bàn phím bật lên giữa chừng làm lệch cuộn.
    setTimeout(() => document.getElementById('loc-tim')?.focus({ preventScroll: true }), 450);
  };

  const soLocPhu =
    (filters.size !== 'all' ? 1 : 0) +
    (filters.brand !== 'all' ? 1 : 0) +
    (filters.price !== 'all' ? 1 : 0) +
    (filters.sort !== 'default' ? 1 : 0);

  const hien = trongVung && (cuonLen || moBang);

  const oChon = (lop: string) => (
    <>
      <SelectField
        id={`bam-size${lop}`}
        label="Size"
        value={filters.size}
        active={filters.size !== 'all'}
        onChange={(v) => doiLoc({ size: v })}
      >
        <option value="all">Size</option>
        {sizes.map((s) => (
          <option key={s} value={s}>
            Size {s}
          </option>
        ))}
      </SelectField>
      <SelectField
        id={`bam-brand${lop}`}
        label="Thương hiệu"
        value={filters.brand}
        active={filters.brand !== 'all'}
        onChange={(v) => doiLoc({ brand: v })}
      >
        <option value="all">Thương hiệu</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </SelectField>
      <SelectField
        id={`bam-gia${lop}`}
        label="Khoảng giá thuê"
        value={filters.price}
        active={filters.price !== 'all'}
        onChange={(v) => doiLoc({ price: v })}
      >
        <option value="all">Mức giá</option>
        {priceBuckets.map((b) => (
          <option key={b.id} value={b.id}>
            {b.label}
          </option>
        ))}
      </SelectField>
      <SelectField
        id={`bam-sap-xep${lop}`}
        label="Sắp xếp"
        value={filters.sort}
        active={filters.sort !== 'default'}
        onChange={(v) => doiLoc({ sort: v as SortOption })}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </SelectField>
    </>
  );

  return (
    <>
      <div
        aria-hidden={!hien}
        style={{ top: dinh }}
        className={`fixed inset-x-0 z-30 border-b border-hairline bg-surface/90 shadow-[0_6px_20px_rgba(30,26,27,0.06)] backdrop-blur transition-[transform,opacity,visibility] duration-300 ${
          hien ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-full opacity-0'
        }`}
      >
        <div className="container-content flex items-center gap-2 py-2">
          <button
            type="button"
            onClick={veOTim}
            aria-label="Tìm mẫu"
            className="flex size-9 shrink-0 items-center justify-center rounded-full glass-input text-ink/80 hover:text-accent-dark"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-4 w-4"
            >
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
          </button>

          {/* Loại đồ: vuốt ngang; mép phải mờ dần báo hiệu còn mục bên phải. */}
          <div
            role="group"
            aria-label="Lọc theo loại"
            className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] [scrollbar-width:none] lg:flex-none lg:[mask-image:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.filter((c) => c.id !== 'moi-ve').map((c) => {
              const active = filters.category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => doiLoc({ category: c.id })}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    active
                      ? 'bg-gradient-to-r from-accent to-accent-dark text-surface shadow-md'
                      : 'bg-white/50 text-ink/80 hover:text-accent-dark'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Máy tính: 4 ô chọn hiện sẵn. */}
          <div className="ml-auto hidden grid-cols-4 gap-2 lg:grid lg:w-[34rem]">
            {oChon('-thanh')}
          </div>

          {/* Điện thoại / máy tính bảng: nút mở bảng lọc. */}
          <button
            type="button"
            onClick={() => setMoBang(true)}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-inset transition-colors sm:text-sm lg:hidden ${
              soLocPhu > 0
                ? 'bg-accent/10 text-accent-dark ring-accent/40'
                : 'text-ink ring-hairline'
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-4 w-4"
            >
              <path d="M3 5h14M6 10h8M8.5 15h3" />
            </svg>
            Lọc
            {soLocPhu > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white">
                {soLocPhu}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bảng lọc từ dưới lên (điện thoại). */}
      {moBang && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Lọc mẫu"
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setMoBang(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 shadow-glass-lg">
            <div className="mx-auto h-1 w-10 rounded-full bg-hairline" aria-hidden="true" />
            <div className="mt-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink">Lọc mẫu</h2>
              <button
                type="button"
                onClick={() => setMoBang(false)}
                aria-label="Đóng"
                className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-tint/60"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">{oChon('-bang')}</div>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  requestAnimationFrame(veDauLuoi);
                }}
                className="px-2 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
              >
                Xoá bộ lọc
              </button>
              <button
                type="button"
                onClick={() => setMoBang(false)}
                className="btn btn-primary ml-auto flex-1 !py-3 text-[15px]"
              >
                Xem mẫu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
