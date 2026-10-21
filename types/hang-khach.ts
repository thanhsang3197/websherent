/**
 * Một hạng thành viên (api-cong-khai.md §2.7). API luôn trả đúng 3 hạng có
 * quyền lợi (Bạc · Vàng · Kim Cương), đã sắp từ thấp lên cao. Hạng khởi đầu
 * "Thường" KHÔNG có trong danh sách — web tự viết cột "Thành viên mới".
 */
export interface HangKhach {
  /** Mã cố định ("Thân thiết", "VIP", "VIP Kim Cương") — chọn màu theo mã này. */
  ma: string;
  /** Tên in cho khách: Bạc · Vàng · Kim Cương. */
  ten: string;
  thuTu: number;
  diemToiThieu: number;
  /** `null` = không xét lượt, chỉ cần đủ điểm. */
  luotToiThieu: number | null;
  giamPhanTram: number;
  /** Miễn phí thuê phụ kiện, không thu cọc phụ kiện; cọc váy vẫn thu (chủ shop chốt 22/10/2026). */
  freePhuKien: boolean;
  /** Quyền lợi không tính tiền (quà, ưu tiên…), mỗi phần tử một dòng. */
  quyenLoiKhac: string[];
}

export interface ChuongTrinhHang {
  /** Số tiền phí thuê đổi được 1 điểm (hiện 1.000 đ). */
  dongMoiDiem: number;
  hang: HangKhach[];
}
