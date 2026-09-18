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

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dam-vay', label: 'Đầm & Váy' },
  { id: 'ao-dai', label: 'Áo dài' },
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
}: {
  filters: Filters;
  brands: string[];
  sizes: string[];
  priceBuckets: readonly { id: string; label: string }[];
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
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
        Loại: điện thoại xếp MỘT hàng vuốt ngang (trước đây gãy 3 + 2 nút, tốn
        thêm một hàng); từ sm trở lên đủ rộng nên các nút giãn đều.
        `-mx-4 px-4` cho hàng vuốt chạm sát mép khung, nút cuối không bị cắt
        cứng giữa chừng trông như lỗi.
      */}
      <div
        className="no-scrollbar -mx-4 mt-3 overflow-x-auto px-4 sm:mx-0 sm:mt-4 sm:px-0"
        role="group"
        aria-label="Lọc theo loại"
      >
        <div className="flex w-max gap-1.5 rounded-full glass-pill p-1.5 sm:w-full">
          {CATEGORIES.map((c) => {
            const active = filters.category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ category: c.id })}
                className={`flex-1 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition-all sm:text-sm ${
                  active
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-surface shadow-md'
                    : 'text-ink/80 hover:bg-white/40 hover:text-accent-dark'
                }`}
              >
                {c.label}
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
