/**
 * Một feedback của khách — ảnh khách mặc đồ của tiệm (api-cong-khai.md §2.5).
 *
 * KHÔNG có tên thật hay số điện thoại: bên app cố ý không nối feedback với
 * khách hàng, website chỉ nhận tên hiển thị shop tự gõ.
 */
export interface Feedback {
  id: string;
  /** Ảnh khách mặc đồ. Luôn có ít nhất 1 tấm; tấm đầu là ảnh bìa. */
  anh: string[];
  /** Ảnh chụp tin nhắn khách khen. [] = không có. */
  anhTinNhan: string[];
  loiKhach: string | null;
  /** null = ẩn danh -> hiện "Khách hàng của Sherent". */
  tenHienThi: string | null;
  /** Mã dịp để lọc (`CUOI`, `TOT_NGHIEP`…) và nhãn tiếng Việt. */
  dip: string | null;
  dipTen: string | null;
  /** "Tháng 9/2026", hoặc null. */
  thang: string | null;
  /**
   * Mẫu khách mặc, đã đối chiếu với catalogue ĐÃ GỘP SIZE của web. null = không
   * gắn mẫu, mẫu đã ngừng, hoặc không tìm thấy trên web.
   */
  mau: { slug: string; ten: string } | null;
  /** Tên tài khoản Instagram, không kèm @. */
  instagram: string | null;
  /** Thứ tự ở dải trang chủ; null = không ghim. */
  noiBatThuTu: number | null;
  nangTho: boolean;
}
