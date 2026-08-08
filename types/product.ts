/**
 * Kiểu dữ liệu sản phẩm.
 *
 * QUAN TRỌNG: `Product` chỉ chứa các field PUBLIC (được phép hiển thị cho khách).
 * Các cột nội bộ trong Google Sheet — Giá nhập, Tổng doanh thu, Tỉ lệ hoàn vốn —
 * TUYỆT ĐỐI không được đưa vào đây (không lộ ra HTML / API response).
 */

export type ProductCategory = 'ao-dai' | 'dam-vay' | 'phap-phuc';

export interface Product {
  /** Mã SP, khoá chính. Vd "T001", "AD025". */
  id: string;
  /** URL slug thân thiện (không dấu), vd "amy-dress-s-t001". */
  slug: string;
  /** Tên sản phẩm hiển thị. */
  name: string;
  /** Brand đã chuẩn hoá (gộp các biến thể gõ sai). null nếu Sheet để trống. */
  brand: string | null;
  /**
   * Danh sách size đã chuẩn hoá & gộp: vd ["S"], ["S","M"], ["S","M","L"].
   * Một mẫu có nhiều size (nhiều dòng trong Sheet) được gộp thành 1 sản phẩm,
   * `sizes` là hợp của các size đó (đã sắp xếp XS→S→M→L→XL→Freesize).
   * Rỗng [] nếu Sheet không ghi size.
   */
  sizes: string[];
  /** Phân loại: đầm/váy (tiệc), áo dài, hoặc pháp phục. */
  category: ProductCategory;
  /** Phí thuê (VND, số nguyên). Vd 200000. 0 nếu không parse được. */
  rentPrice: number;
  /** Phí cọc (VND, số nguyên). */
  depositPrice: number;
  /** Ảnh CHÍNH (thumbnail/OG) — đã chuẩn hoá. null nếu chưa có ảnh. */
  image: string | null;
  /**
   * TOÀN BỘ ảnh của mẫu (gallery), ảnh chính đứng đầu.
   * = ảnh cột "Ảnh sản phẩm" + các link ở cột "Ảnh phụ" (cách nhau bằng phẩy/xuống dòng),
   * đã gộp & khử trùng. [] nếu chưa có ảnh nào.
   */
  images: string[];
  /*
   * Không có trường `status`: cột "Trạng Thái" trong Sheet chỉ dùng để LỌC ở
   * lib/mapping.ts (mẫu "Đã thanh lý" bị bỏ hẳn), không hiển thị cho khách —
   * nên cũng không gửi kèm xuống trình duyệt.
   */
}

/**
 * Nhãn tiếng Việt cho từng category (dùng ở filter, breadcrumb, schema...).
 */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'ao-dai': 'Áo dài',
  'dam-vay': 'Đầm & Váy',
  'phap-phuc': 'Pháp phục',
};
