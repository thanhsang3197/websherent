'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/product';
import { listRentPrice } from '@/lib/format';
import { fitSize } from '@/lib/brands';
import { trackEmptySearch, trackFilterUse } from '@/lib/analytics';
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

/**
 * Khoảng giá thuê 1 ngày (VND, xem `listRentPrice`). test() dùng để lọc; label
 * để hiển thị. Nhãn viết "k" cho gọn: ô chọn trên điện thoại chỉ rộng ~147px,
 * "100.000 – 200.000₫" bị cắt cụt ngay khi đã chọn.
 */
const PRICE_BUCKETS = [
  { id: 'lt100', label: 'Dưới 100k', test: (p: number) => p > 0 && p < 100000 },
  {
    id: '100-200',
    label: '100k – 200k',
    test: (p: number) => p >= 100000 && p < 200000,
  },
  {
    id: '200-300',
    label: '200k – 300k',
    test: (p: number) => p >= 200000 && p < 300000,
  },
  { id: 'gt300', label: 'Từ 300k', test: (p: number) => p >= 300000 },
] as const;

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'Freesize'];

/**
 * Tên trường hiển thị trên dashboard analytics. Chủ shop là người đọc báo cáo,
 * nên để tiếng Việt thay vì tên biến trong code ('category', 'sort'...).
 */
const TEN_TRUONG: Record<string, string> = {
  category: 'Loại',
  brand: 'Thương hiệu',
  size: 'Size',
  price: 'Tầm giá',
  sort: 'Sắp xếp',
};

/** Nhãn dễ đọc cho giá trị lọc; không có trong bảng thì giữ nguyên giá trị. */
const TEN_GIA_TRI: Record<string, string> = {
  'price-asc': 'Giá thấp → cao',
  'price-desc': 'Giá cao → thấp',
  'name-asc': 'Tên A → Z',
};

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
    () => sortSizes(Array.from(new Set(products.flatMap((p) => p.sizes.map(fitSize))))),
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
      cat === 'gam' ||
      cat === 'phu-kien'
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
      if (filters.size !== 'all' && !p.sizes.some((s) => fitSize(s) === filters.size)) {
        return false;
      }
      if (bucket && !bucket.test(listRentPrice(p).price)) return false;
      if (query) {
        const hay = norm(`${p.name} ${p.brand ?? ''}`);
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    if (filters.sort === 'price-asc') {
      return [...list].sort((a, b) => listRentPrice(a).price - listRentPrice(b).price);
    }
    if (filters.sort === 'price-desc') {
      return [...list].sort((a, b) => listRentPrice(b).price - listRentPrice(a).price);
    }
    if (filters.sort === 'name-asc') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    return list;
  }, [products, filters]);

  const onChange = useCallback((patch: Partial<Filters>) => {
    /*
      Ghi nhận việc khách CHỌN một bộ lọc (lib/analytics.ts).

      Bỏ qua hai trường hợp, đều để khỏi đốt hạn mức sự kiện mà chẳng thu được
      gì: ô tìm kiếm (`q` đổi theo từng phím — đã có sự kiện "Tìm không ra
      mẫu" lo phần này) và thao tác BỎ lọc (về 'all'/'default').
    */
    for (const [truong, giaTri] of Object.entries(patch)) {
      if (truong === 'q') continue;
      if (giaTri === 'all' || giaTri === 'default' || giaTri == null) continue;
      const giaTriStr = String(giaTri);
      trackFilterUse(
        TEN_TRUONG[truong] ?? truong,
        CATEGORY_LABELS[giaTriStr as ProductCategory] ??
          PRICE_BUCKETS.find((b) => b.id === giaTriStr)?.label ??
          TEN_GIA_TRI[giaTriStr] ??
          giaTriStr,
      );
    }
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  /*
    Khách gõ tìm mà không ra mẫu nào -> ghi lại từ khoá.

    Đây là danh sách "thứ khách hỏi mà tiệm chưa có", dùng cho khâu nhập hàng,
    nên phải sạch:
      - đợi 1,2 giây sau phím cuối, không bắn theo từng chữ cái;
      - bỏ qua từ khoá dưới 2 ký tự (gõ dở);
      - mỗi từ khoá + loại chỉ bắn MỘT lần trong một phiên, để khách xoá đi gõ
        lại không nhân đôi số liệu.
  */
  const daGhiTimKhongRa = useRef(new Set<string>());
  useEffect(() => {
    const tuKhoa = filters.q.trim();
    if (tuKhoa.length < 2 || filtered.length > 0) return;

    const khoa = `${norm(tuKhoa)}|${filters.category}`;
    if (daGhiTimKhongRa.current.has(khoa)) return;

    const id = setTimeout(() => {
      daGhiTimKhongRa.current.add(khoa);
      trackEmptySearch(
        tuKhoa,
        CATEGORY_LABELS[filters.category as ProductCategory] ?? 'Tất cả',
      );
    }, 1200);
    return () => clearTimeout(id);
  }, [filters.q, filters.category, filtered.length]);

  const onReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div>
      <ProductFilters
        filters={filters}
        brands={brands}
        sizes={sizes}
        priceBuckets={PRICE_BUCKETS}
        onChange={onChange}
        onReset={onReset}
      />
      <div className="mt-8">
        <ProductGrid products={filtered} priorityCount={4} />
      </div>
    </div>
  );
}
