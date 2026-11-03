import type { ReactNode } from 'react';
import type { ProductCategory } from '@/types/product';

export type CategoryFilter = 'all' | ProductCategory;
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

export interface Filters {
  q: string;
  category: CategoryFilter;
  brand: string; // 'all' hoặc tên brand
  size: string; // 'all' hoặc size
  price: string; // 'all' hoặc id khoảng giá
  sort: SortOption;
}

/**
 * `hoaMai`: gắn bông mai (góc phải, có cánh rơi) và bao lì xì (góc trái) quanh
 * chữ, gợi khách nghĩ tới chụp ảnh Tết.
 */
const CATEGORIES: { id: CategoryFilter; label: string; hoaMai?: boolean }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dam-vay', label: 'Đầm & Váy' },
  { id: 'ao-dai', label: 'Áo dài', hoaMai: true },
  { id: 'phap-phuc', label: 'Pháp phục' },
  { id: 'gam', label: 'Gấm' },
  { id: 'phu-kien', label: 'Phụ kiện' },
];

/*
  Nhãn NGẮN có chủ ý: trên điện thoại mỗi ô chọn chỉ rộng ~147px (2 cột), nhãn
  dài kiểu "Giá thuê: Thấp → Cao" bị cắt cụt ngay khi đã chọn.
*/
const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'default', label: 'Sắp xếp' },
  { id: 'price-asc', label: 'Giá thấp → cao' },
  { id: 'price-desc', label: 'Giá cao → thấp' },
  { id: 'name-asc', label: 'Tên A → Z' },
];

/**
 * Bộ lọc (controlled): tìm kiếm + loại + size + brand + khoảng giá + sắp xếp.
 * Không giữ state — nhận giá trị & callback từ ProductExplorer.
 *
 * Size đứng ĐẦU và cả 4 ô chọn luôn hiện sẵn (không giấu sau nút "Bộ lọc"):
 * chủ shop chốt 16/09/2026 — khách thường chọn size của mình trước rồi mới
 * xem mẫu, nên phải một chạm là tới.
 */
export function ProductFilters({
  filters,
  brands,
  sizes,
  priceBuckets,
  onChange,
  onReset,
  onSubmitSearch,
}: {
  filters: Filters;
  brands: string[];
  sizes: string[];
  priceBuckets: readonly { id: string; label: string }[];
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  /** Khách bấm Enter / nút "Tìm" trên bàn phím điện thoại. */
  onSubmitSearch?: () => void;
}) {
  const isFiltering =
    filters.q !== '' ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.size !== 'all' ||
    filters.price !== 'all' ||
    filters.sort !== 'default';

  /*
    Nhãn các bộ lọc đang bật, bấm × để bỏ riêng từng cái. Không có nhãn cho
    loại (đã có nút tô màu ngay trên) và sắp xếp (không thu hẹp kết quả).
  */
  const activeChips: { key: string; label: string; clear: Partial<Filters> }[] = [];
  if (filters.q) {
    activeChips.push({ key: 'q', label: `“${filters.q}”`, clear: { q: '' } });
  }
  if (filters.size !== 'all') {
    activeChips.push({ key: 'size', label: `Size ${filters.size}`, clear: { size: 'all' } });
  }
  if (filters.brand !== 'all') {
    activeChips.push({ key: 'brand', label: filters.brand, clear: { brand: 'all' } });
  }
  const bucket = priceBuckets.find((b) => b.id === filters.price);
  if (bucket) {
    activeChips.push({ key: 'price', label: bucket.label, clear: { price: 'all' } });
  }

  return (
    <div className="rounded-3xl glass-panel p-4 shadow-glass sm:p-6">
      {/* Tìm kiếm */}
      <div className="relative">
        <label htmlFor="loc-tim" className="sr-only">
          Tìm theo tên hoặc thương hiệu
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m13 13 4 4" />
        </svg>
        <input
          id="loc-tim"
          type="search"
          inputMode="search"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          onKeyDown={(e) => {
            // Bỏ qua lúc đang gõ dấu tiếng Việt (bộ gõ còn đang ghép chữ).
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSubmitSearch?.();
          }}
          placeholder="Tìm tên mẫu hoặc thương hiệu…"
          className="w-full rounded-full glass-input py-3 pl-11 pr-11 text-sm text-ink placeholder:text-muted focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {filters.q && (
          <button
            type="button"
            onClick={() => onChange({ q: '' })}
            aria-label="Xoá từ khoá tìm kiếm"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/60 hover:text-accent-dark"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/*
        Loại: điện thoại xếp lưới 3 × 2 gọn, thấy đủ 6 mục không cần vuốt.
        Trước đây là một hàng vuốt ngang, khách không biết còn Gấm / Phụ kiện
        ở bên phải (chủ shop yêu cầu 02/10/2026). Từ sm trở lên đủ rộng nên
        vẫn một hàng, các nút giãn đều.
      */}
      <div className="mt-3 sm:mt-4" role="group" aria-label="Lọc theo loại">
        <div className="grid grid-cols-3 gap-1 rounded-2xl glass-pill p-1 sm:flex sm:gap-1.5 sm:rounded-full sm:p-1.5">
          {CATEGORIES.map((c) => {
            const active = filters.category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ category: c.id })}
                className={`whitespace-nowrap rounded-xl px-2 py-1.5 text-xs font-medium transition-all sm:flex-1 sm:rounded-full sm:px-3.5 sm:py-2 sm:text-sm ${
                  active
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-surface shadow-md'
                    : 'text-ink/80 hover:bg-white/40 hover:text-accent-dark'
                }`}
              >
                {/* Nút giãn rộng trên máy tính: neo hoa vào CHỮ, không vào mép nút. */}
                <span className="relative">
                  {c.label}
                  {c.hoaMai && (
                    <>
                      <BaoLiXi />
                      <HoaMai />
                      <CanhMaiRoi />
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size / Brand / Giá / Sắp xếp — điện thoại 2 cột, máy tính 4 cột */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 lg:grid-cols-4">
        <SelectField
          id="loc-size"
          label="Size"
          value={filters.size}
          active={filters.size !== 'all'}
          onChange={(v) => onChange({ size: v })}
        >
          <option value="all">Size</option>
          {sizes.map((s) => (
            <option key={s} value={s}>
              Size {s}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="loc-brand"
          label="Thương hiệu"
          value={filters.brand}
          active={filters.brand !== 'all'}
          onChange={(v) => onChange({ brand: v })}
        >
          <option value="all">Thương hiệu</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="loc-gia"
          label="Khoảng giá thuê"
          value={filters.price}
          active={filters.price !== 'all'}
          onChange={(v) => onChange({ price: v })}
        >
          <option value="all">Mức giá</option>
          {priceBuckets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="loc-sap-xep"
          label="Sắp xếp"
          value={filters.sort}
          active={filters.sort !== 'default'}
          onChange={(v) => onChange({ sort: v as SortOption })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </SelectField>
      </div>

      {/* Bộ lọc đang bật */}
      {activeChips.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Bộ lọc đang bật">
          {activeChips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={() => onChange(chip.clear)}
                aria-label={`Bỏ lọc ${chip.label}`}
                className="flex max-w-[16rem] items-center gap-1 rounded-full border border-accent/30 bg-accent/10 py-1 pl-3 pr-1.5 text-xs font-medium text-accent-dark transition-colors hover:bg-accent/15"
              >
                <span className="truncate">{chip.label}</span>
                <CloseIcon className="h-3.5 w-3.5 shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/*
        KHÔNG hiện số mẫu ở đâu trong khung lọc — cả cạnh tên loại lẫn "80 / 268
        mẫu" khi lọc. Chủ shop chốt 17/09/2026: không muốn người ngoài đếm được
        tiệm có bao nhiêu mẫu.
      */}
      {isFiltering && (
        <div className="mt-3 flex justify-end text-sm sm:mt-4">
          <button
            type="button"
            onClick={onReset}
            className="font-medium text-accent-dark underline-offset-4 hover:underline"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Ô chọn có mũi tên xổ xuống (trước đây `appearance-none` mà không vẽ lại mũi
 * tên nên trông như ô chữ thường). Đang lọc -> viền + chữ màu đất nung để
 * khách thấy ngay mình đang lọc theo gì.
 */
function SelectField({
  id,
  label,
  value,
  active,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  active: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full cursor-pointer appearance-none truncate rounded-full glass-input py-2.5 pl-4 pr-9 text-sm outline-none ${
          active ? 'border-accent font-medium text-accent-dark' : 'text-ink'
        }`}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
          active ? 'text-accent-dark' : 'text-muted'
        }`}
      >
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </div>
  );
}

/** Bông mai vàng 5 cánh kèm một nụ, đặt chéo góc trên bên phải nút. */
function HoaMai() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="pointer-events-none absolute -right-5 -top-3 h-5 w-5 rotate-12 drop-shadow-[0_1px_1.5px_rgba(150,90,0,0.35)] sm:-right-6 sm:-top-3.5 sm:h-6 sm:w-6"
    >
      <defs>
        <radialGradient id="hoa-mai-canh" cx="50%" cy="85%" r="85%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="55%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FEF08A" />
        </radialGradient>
      </defs>
      {/* nụ */}
      <path d="M26 25.5c-1.6-.4-2.4-2.2-1.6-3.6.8-1.4 2.9-1.6 3.9-.3.9 1.3.2 3.5-2.3 3.9Z" fill="#FCD34D" />
      <path d="M23.4 23.2 20.5 20" stroke="#8B5A2B" strokeWidth="1.1" strokeLinecap="round" />
      {/* 5 cánh */}
      <g transform="translate(14 14)">
        {[0, 72, 144, 216, 288].map((goc) => (
          <path
            key={goc}
            transform={`rotate(${goc})`}
            d="M0 0C-4.2-2.2-5.2-7.6-2.6-10.6-1.4-11.9.0-11.4 0-10.2.0-11.4 1.4-11.9 2.6-10.6 5.2-7.6 4.2-2.2 0 0Z"
            fill="url(#hoa-mai-canh)"
            stroke="#EAB308"
            strokeWidth="0.5"
          />
        ))}
        {/* nhị */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((goc) => (
          <g key={goc} transform={`rotate(${goc})`}>
            <path d="M0 0V-4.4" stroke="#C2410C" strokeWidth="0.6" strokeLinecap="round" />
            <circle cy="-4.8" r="0.7" fill="#9A3412" />
          </g>
        ))}
        <circle r="1.7" fill="#EA580C" />
      </g>
    </svg>
  );
}

/** Vài cánh mai rơi từ bông hoa xuống, lệch nhịp (keyframes `mai-roi`). */
const CANH_ROI = [
  { left: 'calc(100% + 6px)', delay: '0s', duration: '5.5s' },
  { left: 'calc(100% + 12px)', delay: '1.9s', duration: '6.2s' },
  { left: 'calc(100% + 3px)', delay: '3.6s', duration: '5s' },
];

function CanhMaiRoi() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {CANH_ROI.map((c) => (
        <span
          key={c.delay}
          className="mai-roi"
          style={{ left: c.left, top: '-2px', animationDelay: c.delay, animationDuration: c.duration }}
        />
      ))}
    </span>
  );
}

/** Bao lì xì đỏ viền vàng, đặt chéo góc trên bên trái chữ. */
function BaoLiXi() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 30"
      className="pointer-events-none absolute -left-4 -top-2.5 h-[18px] w-[14px] -rotate-12 drop-shadow-[0_1px_1.5px_rgba(120,20,20,0.35)] sm:-left-5 sm:-top-3 sm:h-[22px] sm:w-[18px]"
    >
      <defs>
        <linearGradient id="li-xi-do" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="28" rx="2.5" fill="url(#li-xi-do)" stroke="#FBBF24" strokeWidth="1.2" />
      <path d="M1.6 3.5 12 12.5 22.4 3.5" fill="none" stroke="#FBBF24" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.6" fill="#FBBF24" />
      <circle cx="12" cy="13" r="2" fill="none" stroke="#B91C1C" strokeWidth="0.8" />
      <path d="M6 22.5h12M7.5 25h9" stroke="#FCD34D" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function CloseIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <path d="m6 6 8 8M14 6l-8 8" />
    </svg>
  );
}
