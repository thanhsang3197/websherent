'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import {
  ProductFilters,
  type Filters,
  type CategoryFilter,
  type SortOption,
} from '@/components/ProductFilters';

const DEFAULT_FILTERS: Filters = {
  q: '',
  category: 'all',
  brand: 'all',
  size: 'all',
  price: 'all',
  sort: 'default',
};

/** Khoảng giá thuê (VND). test() dùng để lọc; label để hiển thị. */
const PRICE_BUCKETS = [
  { id: 'lt100', label: 'Dưới 100.000₫', test: (p: number) => p > 0 && p < 100000 },
  {
    id: '100-200',
    label: '100.000 – 200.000₫',
    test: (p: number) => p >= 100000 && p < 200000,
  },
  {
    id: '200-300',
    label: '200.000 – 300.000₫',
    test: (p: number) => p >= 200000 && p < 300000,
  },
  { id: 'gt300', label: 'Từ 300.000₫', test: (p: number) => p >= 300000 },
] as const;

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'Freesize'];

/** Bỏ dấu để tìm kiếm không phân biệt dấu ("ao dai" khớp "Áo dài"). */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b, 'vi');
  });
}

/**
 * Container lọc + lưới (client). Nhận toàn bộ products từ server (đã SSR để SEO),
 * lọc phía client. Đồng bộ trạng thái lọc vào URL query để chia sẻ được.
 */
export function ProductExplorer({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Facet từ dữ liệu thật.
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.brand)
            .filter((b): b is string => Boolean(b)),
        ),
      ).sort((a, b) => a.localeCompare(b, 'vi')),
    [products],
  );

  const sizes = useMemo(
    () => sortSizes(Array.from(new Set(products.flatMap((p) => p.sizes)))),
    [products],
  );

  // Khôi phục bộ lọc từ URL khi tải.
  const didInitFromUrl = useRef(false);
  useEffect(() => {
    if (didInitFromUrl.current) return;
    didInitFromUrl.current = true;
    const sp = new URLSearchParams(window.location.search);
    const next: Filters = { ...DEFAULT_FILTERS };
    const q = sp.get('q');
    if (q) next.q = q;
    const cat = sp.get('loai');
    if (
      cat === 'ao-dai' ||
      cat === 'dam-vay' ||
      cat === 'phap-phuc' ||
      cat === 'gam'
    ) {
      next.category = cat as CategoryFilter;
    }
    const brand = sp.get('brand');
    if (brand) next.brand = brand;
    const size = sp.get('size');
    if (size) next.size = size;
    const price = sp.get('gia');
    if (price && PRICE_BUCKETS.some((b) => b.id === price)) next.price = price;
    const sort = sp.get('sort');
    if (sort === 'price-asc' || sort === 'price-desc' || sort === 'name-asc') {
      next.sort = sort as SortOption;
    }
    setFilters(next);
  }, []);

  // Ghi bộ lọc hiện tại vào URL.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set('q', filters.q);
    if (filters.category !== 'all') sp.set('loai', filters.category);
    if (filters.brand !== 'all') sp.set('brand', filters.brand);
    if (filters.size !== 'all') sp.set('size', filters.size);
    if (filters.price !== 'all') sp.set('gia', filters.price);
    if (filters.sort !== 'default') sp.set('sort', filters.sort);
    const qs = sp.toString();
    const { pathname, hash } = window.location;
    window.history.replaceState(null, '', `${pathname}${qs ? `?${qs}` : ''}${hash}`);
  }, [filters]);

  const filtered = useMemo(() => {
    const query = norm(filters.q.trim());
    const bucket = PRICE_BUCKETS.find((b) => b.id === filters.price);
    const list = products.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.brand !== 'all' && p.brand !== filters.brand) return false;
      if (filters.size !== 'all' && !p.sizes.includes(filters.size)) return false;
      if (bucket && !bucket.test(p.rentPrice)) return false;
      if (query) {
        const hay = norm(`${p.name} ${p.brand ?? ''}`);
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    if (filters.sort === 'price-asc') {
      return [...list].sort((a, b) => a.rentPrice - b.rentPrice);
    }
    if (filters.sort === 'price-desc') {
      return [...list].sort((a, b) => b.rentPrice - a.rentPrice);
    }
    if (filters.sort === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    return list;
  }, [products, filters]);

  const onChange = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const onReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div>
      <ProductFilters
        filters={filters}
        brands={brands}
        sizes={sizes}
        priceBuckets={PRICE_BUCKETS}
        resultCount={filtered.length}
        total={products.length}
        onChange={onChange}
        onReset={onReset}
      />
      <div className="mt-8">
        <ProductGrid products={filtered} priorityCount={4} />
      </div>
    </div>
  );
}
