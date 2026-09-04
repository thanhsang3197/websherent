/**
 * Một slide của khung ảnh đầu trang (hero).
 *
 * Hero KHÔNG còn chỉ xoay vòng qua các mẫu: từ 04/09/2026 shop treo thêm được
 * ẢNH TỰ DO — ảnh không thuộc mẫu nào (banner khuyến mãi, ảnh studio, ảnh mặt
 * tiền) — và tự sắp xen kẽ với các mẫu (api-cong-khai.md §2.3).
 *
 * Đây là kiểu ĐÃ CHUẨN HOÁ cho giao diện: hai loại slide gộp về một hình dạng
 * để `HeroCarousel` không phải rẽ nhánh theo dữ liệu API. Việc rẽ nhánh xảy ra
 * đúng một lần, ở chỗ map dữ liệu (`lib/internal-api.ts`).
 */
export interface HeroSlide {
  /**
   * 'san_pham' = ảnh chụp mẫu; 'anh' = ảnh tự do shop treo (banner, ảnh
   * studio, ảnh chụp màn hình trang IG…).
   *
   * Giao diện cần phân biệt vì hai loại phải CẮT KHÁC NHAU: ảnh mẫu đã chụp
   * dọc sẵn nên phủ kín khung được, còn ảnh tự do thì tỉ lệ tuỳ ý và chữ có
   * thể nằm sát mép — cắt là mất đúng phần shop muốn khách đọc.
   */
  kieu: 'san_pham' | 'anh';
  /** Ảnh để hiện. Luôn có — §2.3 bảo đảm `anh` không bao giờ null. */
  url: string;
  /** Chữ mô tả ảnh (thuộc tính `alt`). */
  alt: string;
  /**
   * Chữ shop muốn HIỆN ĐÈ lên ảnh. Chỉ ảnh tự do mới có; null = ảnh trơn.
   * Đừng vẽ khối chữ rỗng khi null (§2.3).
   */
  caption: string | null;
  /**
   * Bấm vào slide thì đi đâu. null = slide không bấm được.
   * Chỉ ảnh tự do mới có (trường `lien_ket` bên API).
   */
  href: string | null;
}
