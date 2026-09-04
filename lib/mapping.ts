/**
 * Chuyển 1 dòng dữ liệu thô (từ Google Sheets API hoặc CSV) -> Product.
 *
 * ĐÂY LÀ NGUỒN SỰ THẬT DUY NHẤT cho việc map dữ liệu: cả lib/sheets.ts (runtime)
 * lẫn scripts/generate-mock.ts (sinh mock) đều dùng hàm này, nên mock == dữ liệu Sheet.
 *
 * Thứ tự cột (Sheet range A..K, và CSV cũng cùng thứ tự):
 *   0 Mã SP | 1 Tên Sản Phẩm | 2 Brand | 3 Giá Thuê | 4 Giá Cọc | 5 Size
 *   6 Giá nhập (NỘI BỘ, bỏ) | 7 Tổng doanh thu (NỘI BỘ, bỏ) | 8 Tỉ lệ hoàn vốn (NỘI BỘ, bỏ)
 *   9 Ảnh sản phẩm | 10 Trạng Thái
 */

import type { Product } from '../types/product';
import { parseVnd, normalizeImageUrl, parseImageList } from './format';
import { buildProductSlug, slugify } from './slug';
import { normalizeBrand, normalizeSize, deriveCategory } from './brands';

/** Chỉ số cột trong dòng thô. */
const COL = {
  id: 0,
  name: 1,
  brand: 2,
  rent: 3,
  deposit: 4,
  size: 5,
  image: 9,
  status: 10,
  gallery: 11, // cột "Ảnh phụ" (thêm ở cuối) — nhiều link cách nhau bằng phẩy/xuống dòng
} as const;

function cell(row: string[], index: number): string {
  return (row[index] ?? '').trim();
}

/**
 * Map 1 dòng -> Product, hoặc null nếu dòng rỗng (không có Mã SP — dòng template).
 * Chỉ trích các field PUBLIC; các cột nội bộ (giá nhập/doanh thu/ROI) bị bỏ hoàn toàn.
 */
export function mapRowToProduct(row: string[]): Product | null {
  const id = cell(row, COL.id);
  if (!id) return null; // lọc ~50k dòng template rỗng

  // Mẫu "Đã thanh lý" = đã bán, không còn cho thuê -> KHÔNG đưa lên web.
  // Dùng slugify để khớp cả khi gõ khác hoa/thường hoặc thiếu dấu.
  if (slugify(cell(row, COL.status)).includes('thanh-ly')) return null;

  const name = cell(row, COL.name) || id;
  const image = normalizeImageUrl(cell(row, COL.image)); // ảnh chính
  const size = normalizeSize(cell(row, COL.size));
  // Gallery = ảnh chính + các link ở cột "Ảnh phụ", khử trùng, ảnh chính đứng đầu.
  const images = Array.from(
    new Set([image, ...parseImageList(cell(row, COL.gallery))].filter(
      (u): u is string => Boolean(u),
    )),
  );

  return {
    id,
    slug: buildProductSlug(name, id),
    name,
    brand: normalizeBrand(cell(row, COL.brand)),
    sizes: size ? [size] : [], // 1 size/dòng; gộp nhiều size ở groupProducts()
    category: deriveCategory(id, name, image),
    rentPrice: parseVnd(cell(row, COL.rent)),
    depositPrice: parseVnd(cell(row, COL.deposit)),
    image,
    images,
  };
}

/**
 * Map nhiều dòng, bỏ header (nếu có) và các dòng rỗng.
 * @param rows Mảng dòng thô (đã gồm hoặc chưa gồm header).
 * @param hasHeader Bỏ dòng đầu nếu true.
 */
export function mapRows(rows: string[][], hasHeader = false): Product[] {
  const body = hasHeader ? rows.slice(1) : rows;
  const out: Product[] = [];
  for (const row of body) {
    const product = mapRowToProduct(row);
    if (product) out.push(product);
  }
  return out;
}

/**
 * Sắp xếp để hiển thị:
 *  1) Sản phẩm CÓ ẢNH lên đầu, rồi mới tới sản phẩm chưa có ảnh.
 *  2) Trong mỗi nhóm: GIỮ NGUYÊN thứ tự đã nhận (API nội bộ tự trả "mới nhất
 *     trước" theo docs/api-cong-khai.md §2 — không tự sắp lại đè lên, `Array.sort`
 *     ổn định nên chỉ tách nhóm có-ảnh/không-ảnh mà không xáo trộn bên trong).
 *
 * Vì bộ lọc category/brand/size/giá đều lọc trên danh sách đã sắp xếp này
 * (Array.filter giữ nguyên thứ tự), nên mọi tab (Tất cả / Đầm & Váy / Áo dài)
 * đều hiển thị theo đúng thứ tự trên.
 */
export function sortProductsForDisplay(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const aHasImg = a.image ? 0 : 1;
    const bHasImg = b.image ? 0 : 1;
    return aHasImg - bHasImg;
  });
}

// ----- Gộp mẫu nhiều size thành 1 sản phẩm -----

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'Freesize'];

function sizeRank(size: string): number {
  const i = SIZE_ORDER.indexOf(size);
  return i === -1 ? SIZE_ORDER.length : i;
}

/** Dedupe + sắp xếp size theo thứ tự XS→S→M→L→XL→Freesize (size lạ xếp cuối). */
export function sortSizeList(sizes: string[]): string[] {
  return Array.from(new Set(sizes)).sort((a, b) => {
    const ra = sizeRank(a);
    const rb = sizeRank(b);
    return ra !== rb ? ra - rb : a.localeCompare(b, 'vi');
  });
}

/** Bỏ token size đứng riêng khỏi tên ("Amy Dress S" -> "Amy Dress"). */
function cleanSizeFromName(name: string): string {
  const cleaned = name
    .replace(/\b(xs|xl|s|m|l|freesize|free\s?size|size)\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return cleaned || name;
}

/**
 * Khoá gộp "cùng một mẫu": theo tên (đã bỏ size) + brand.
 *
 * TỪNG dùng URL ảnh làm khoá khi có ảnh, với giả định "cùng tấm hình = cùng
 * chiếc đầm". Sai trong thực tế: app nội bộ cho chụp ảnh riêng theo TỪNG MÃ SP
 * (mỗi size một mã, một thư mục ảnh trên Supabase Storage), nên 2 size của
 * cùng 1 mẫu luôn có 2 URL ảnh khác nhau -> gộp theo ảnh gần như không bao giờ
 * khớp, ví dụ "Elory Dress" size S (T013) và L (T015) bị tách thành 2 sản
 * phẩm. Gộp theo tên+brand đáng tin hơn cho catalogue này (đã đối chiếu dữ
 * liệu thật: không nhóm nào vượt quá 3 size/mẫu).
 */
function groupingKey(p: Product): string {
  return `name::${slugify(cleanSizeFromName(p.name))}::${slugify(p.brand ?? '')}`;
}

/** Gộp các dòng cùng một mẫu (chỉ khác size) thành 1 sản phẩm với `sizes` hợp nhất. */
export function groupProducts(products: Product[]): Product[] {
  const groups = new Map<string, Product[]>();
  const order: string[] = [];
  for (const p of products) {
    const key = groupingKey(p);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(p);
    } else {
      groups.set(key, [p]);
      order.push(key);
    }
  }

  return order.map((key) => {
    const members = groups.get(key)!;
    if (members.length === 1) return members[0];

    // Đại diện: dòng có size nhỏ nhất (S trước M...) để tên gọn.
    const rep = [...members].sort(
      (a, b) => sizeRank(a.sizes[0] ?? '') - sizeRank(b.sizes[0] ?? ''),
    )[0];
    const sizes = sortSizeList(members.flatMap((m) => m.sizes));
    // Gộp gallery của mọi size-variant, ảnh chính của rep đứng đầu.
    const images = Array.from(
      new Set(
        [rep.image, ...members.flatMap((m) => m.images)].filter(
          (u): u is string => Boolean(u),
        ),
      ),
    );

    return {
      ...rep,
      name: cleanSizeFromName(rep.name),
      sizes,
      images,
      // Đại diện `rep` là dòng size nhỏ nhất — không nhất thiết là dòng đang
      // pass. Nếu chỉ lấy `rep.sale` thì một mẫu đang pass ở size L sẽ biến mất
      // khỏi trang thanh lý mà không báo gì. Lấy dòng ĐẦU TIÊN có `sale`.
      sale: members.find((m) => m.sale)?.sale ?? null,
      // Cùng lý do với `sale`: `rep` là dòng size nhỏ nhất, không nhất thiết là
      // dòng shop đã nhập giá. Lấy dòng ĐẦU TIÊN có số, để một mẫu điền giá ở
      // size L không bị mất giá chỉ vì size S bỏ trống.
      rentPrice1Day:
        members.find((m) => m.rentPrice1Day != null)?.rentPrice1Day ?? null,
      tagPrice: members.find((m) => m.tagPrice != null)?.tagPrice ?? null,
    };
  });
}
