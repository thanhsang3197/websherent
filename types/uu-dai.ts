/**
 * Một chương trình ưu đãi của tiệm — gửi ảnh nhận quà, tặng voucher, sự kiện
 * nhỏ (api-cong-khai.md §2.6). API chỉ trả chương trình đang bật VÀ còn trong
 * khoảng ngày chạy, nên mọi phần tử ở đây đều là chương trình đang diễn ra.
 */
export interface UuDai {
  id: string;
  /** Mã cố định: `VOUCHER` · `GUI_ANH` · `SU_KIEN` · `KHAC`. */
  loai: string;
  /** Nhãn tiếng Việt sẵn, vd "Gửi ảnh nhận quà". */
  loaiTen: string;
  tieuDe: string;
  /** Một–hai câu hiện trên thẻ. */
  moTaNgan: string | null;
  /** Poster. null = thẻ chữ trên nền màu. */
  anh: string | null;
  /** Thể lệ đầy đủ, có xuống dòng — hiện ở trang /uu-dai. */
  theLe: string | null;
  /** "YYYY-MM-DD" theo giờ Việt Nam; null = không giới hạn. */
  batDau: string | null;
  ketThuc: string | null;
  /** Có hiện trong thanh mỏng trên cùng mọi trang không. */
  hienThanhTren: boolean;
  /**
   * Có thẻ ở khối "Ưu đãi đang có" trang chủ không. Tắt + `hienThanhTren` bật
   * = chỉ chạy trên thanh (thông báo ngắn kiểu nghỉ lễ). Trang /uu-dai vẫn hiện.
   */
  hienKhoi: boolean;
}
