import type { Product } from './product';

/**
 * Một album shop dựng bên app nội bộ — "Váy dự lễ tốt nghiệp", "Váy ngắn"…
 * (api-cong-khai.md §2.4).
 *
 * Album là một ĐIỀU KIỆN LỌC theo nhãn cộng vài mẫu shop ghim/loại. App đã lọc
 * và sắp sẵn — web chỉ hiển thị, không cần biết nhãn là gì.
 */
export interface Album {
  /** Khoá và đường dẫn trang (`/album/<slug>`). Không đổi khi shop đổi tên. */
  slug: string;
  ten: string;
  /** null = shop không viết mô tả. */
  moTa: string | null;
  /** Ảnh shop chọn, hoặc ảnh mẫu đầu album. null chỉ khi API trả thiếu. */
  anhBia: string | null;
}

/** Trang chi tiết một album: thông tin album + mẫu ĐÃ GỘP SIZE, giữ thứ tự shop. */
export interface AlbumChiTiet {
  album: Album;
  products: Product[];
}
