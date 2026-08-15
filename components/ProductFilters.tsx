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
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'default', label: 'Nổi bật (Mặc định)' },
  { id: 'price-asc', label: 'Giá thuê: Thấp → Cao' },
  { id: 'price-desc', label: 'Giá thuê: Cao → Thấp' },
  { id: 'name-asc', label: 'Tên mẫu A → Z' },
];

const selectClass =
  'w-full appearance-none rounded-full glass-input px-4 py-2.5 text-sm text-ink outline-none cursor-pointer';

/**
 * Bộ lọc (controlled): tìm kiếm + loại + brand + size + khoảng giá + sắp xếp.
 * Không giữ state — nhận giá trị & callback từ ProductExplorer.
 */
export function ProductFilters({
  filters,
  brands,
  sizes,
  priceBuckets,
  resultCount,
  total,
  onChange,
  onReset,
}: {
  filters: Filters;
  brands: string[];
  sizes: string[];
  priceBuckets: readonly { id: string; label: string }[];
  resultCount: number;
  total: number;
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

  return (
    <div className="rounded-3xl glass-panel p-4 sm:p-6 shadow-glass">
      {/* Tìm kiếm */}
      <div className="relative">
        <label htmlFor="loc-tim" className="sr-only">
          Tìm theo tên hoặc thương hiệu
        </label>
        <input
          id="loc-tim"
          type="search"
          inputMode="search"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Tìm theo tên mẫu hoặc thương hiệu…"
          className="w-full rounded-full glass-input px-5 py-3 text-sm text-ink placeholder:text-muted focus-visible:outline-none"
        />
      </div>

      {/* Loại */}
      <div
        className="mt-4 flex flex-wrap gap-1.5 rounded-2xl glass-pill p-1.5 sm:rounded-full"
        role="group"
        aria-label="Lọc theo loại"
      >
        {CATEGORIES.map((c) => {
          const active = filters.category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ category: c.id })}
              className={`min-w-[72px] flex-1 rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-accent to-accent-dark text-surface shadow-md scale-[1.02]'
                  : 'text-ink/80 hover:text-accent-dark hover:bg-white/40'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Brand / Size / Giá / Sắp xếp */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="loc-brand" className="sr-only">
            Thương hiệu
          </label>
          <select
            id="loc-brand"
            value={filters.brand}
            onChange={(e) => onChange({ brand: e.target.value })}
            className={selectClass}
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="loc-size" className="sr-only">
            Size
          </label>
          <select
            id="loc-size"
            value={filters.size}
            onChange={(e) => onChange({ size: e.target.value })}
            className={selectClass}
          >
            <option value="all">Tất cả size</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                Size {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="loc-gia" className="sr-only">
            Khoảng giá thuê
          </label>
          <select
            id="loc-gia"
            value={filters.price}
            onChange={(e) => onChange({ price: e.target.value })}
            className={selectClass}
          >
            <option value="all">Mọi mức giá</option>
            {priceBuckets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="loc-sap-xep" className="sr-only">
            Sắp xếp
          </label>
          <select
            id="loc-sap-xep"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            className={selectClass}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kết quả + reset */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span aria-live="polite" className="font-medium">
          {resultCount === total
            ? `${total} mẫu`
            : `${resultCount} / ${total} mẫu`}
        </span>
        {isFiltering && (
          <button
            type="button"
            onClick={onReset}
            className="text-accent-dark font-medium underline-offset-4 hover:underline"
          >
            Xoá bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
