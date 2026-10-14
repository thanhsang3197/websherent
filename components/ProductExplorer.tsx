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

/**
 * Phụ kiện đặt tên theo MÃ ("T1", "D30", "Q05"…) chứ không theo tên món, nên
 * khách gõ "túi" không khớp chữ nào. Bảng này nối từ khoá khách hay gõ (đã bỏ
 * dấu) với chữ cái đầu mã — chủ shop chốt 15/10/2026:
 *   T = túi · D = dây chuyền / vòng cổ · C = cài tóc · Q = quạt
 *   K = kính / kẹp / khoác choàng (một mã dùng chung nhiều món)
 * Kẹp, choàng, trâm, guốc vốn có chữ trong tên nên vẫn tìm thấy theo tên như cũ.
 *
 * `cum`: cụm nhiều chữ, khớp khi nằm trong từ khoá. `tu`: một chữ, khớp khi
 * khách gõ đúng chữ đó hoặc gõ dở từ 3 ký tự ("qua" -> "quat").
 */
const MA_PHU_KIEN: { ma: string; cum: string[]; tu: string[] }[] = [
  { ma: 'T', cum: ['tui xach'], tu: ['tui', 'bop', 'vi', 'clutch'] },
  { ma: 'D', cum: ['day chuyen', 'vong co'], tu: ['chuyen'] },
  { ma: 'C', cum: ['cai toc'], tu: ['cai'] },
  { ma: 'Q', cum: [], tu: ['quat'] },
  { ma: 'K', cum: ['khoac choang'], tu: ['kinh', 'kep', 'khoac', 'choang'] },
];

/** Các chữ đầu mã phụ kiện ứng với từ khoá (đã norm), vd "tui xach" -> ["T"]. */
function maTheoTuKhoa(query: string): string[] {
  const chu = query.split(/\s+/).filter(Boolean);
  return MA_PHU_KIEN.filter(
    (g) =>
      g.cum.some((c) => query.includes(c)) ||
      chu.some((w) => g.tu.some((t) => t === w || (w.length >= 3 && t.startsWith(w)))),
  ).map((g) => g.ma);
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
    // "T" -> khớp tên "T1", "T 45"; không khớp tên có chữ như "Trâm 01".
    const maRe = query
      ? maTheoTuKhoa(query).map((ma) => new RegExp(`^${ma}\\s*\\d`, 'i'))
      : [];
    const list = products.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      // "Tất cả" = trang phục (chủ shop 24/09/2026): phụ kiện chỉ hiện khi khách
      // bấm mục Phụ kiện, hoặc khi khách chủ động gõ tìm — không thì gõ "túi"
      // ra trống trơn và khách tưởng tiệm không có.
      if (filters.category === 'all' && !query && p.category === 'phu-kien') return false;
      if (filters.brand !== 'all' && p.brand !== filters.brand) return false;
      if (filters.size !== 'all' && !p.sizes.some((s) => fitSize(s) === filters.size)) {
        return false;
      }
      if (bucket && !bucket.test(listRentPrice(p).price)) return false;
      if (query) {
        const hay = norm(`${p.name} ${p.brand ?? ''}`);
        const khopMa =
          p.category === 'phu-kien' && maRe.some((re) => re.test(p.name.trim()));
        if (!hay.includes(query) && !khopMa) return false;
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
