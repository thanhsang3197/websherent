import { track } from '@vercel/analytics';

/**
 * Sự kiện tuỳ chỉnh gửi về Vercel Web Analytics.
 *
 * Mục đích: trả lời ba câu hỏi mà số lượt xem trang không trả lời được —
 * khách có bấm Zalo không, bấm từ mẫu nào, và khách tìm gì mà tiệm chưa có.
 *
 * ─── HAI RÀNG BUỘC CỦA GÓI PRO ───────────────────────────────────────────
 * 1. MỖI SỰ KIỆN TỐI ĐA 2 THUỘC TÍNH. Gói Pro thường là 2 (Web Analytics Plus
 *    mới lên 8). Thêm thuộc tính thứ ba KHÔNG báo lỗi — nó bị bỏ im lặng, nên
 *    đừng thêm mà không kiểm tra lại trên dashboard.
 * 2. TÍNH TIỀN THEO SỐ SỰ KIỆN ($0,03 / 1.000). Vì vậy chỉ bắn ở những nhịp
 *    THẬT SỰ có ý nghĩa: không bắn theo từng phím gõ, không bắn khi khách chỉ
 *    bỏ bộ lọc.
 *
 * Tên sự kiện để TIẾNG VIỆT vì chúng hiện thẳng trên dashboard cho chủ shop
 * đọc; khoá thuộc tính để ASCII cho gọn khi lọc.
 *
 * Ở môi trường dev, `track` chỉ in ra console chứ không gửi đi đâu — cứ bấm
 * thoải mái khi đang code.
 */

/** Nơi khách bấm — để biết nút nào trên trang nào đang thật sự được dùng. */
export type ViTri =
  | 'chi-tiet'
  | 'xem-nhanh'
  | 'thanh-ly'
  | 'header'
  | 'footer'
  | 'nut-noi'
  | 'gioi-thieu'
  | 'hoi-dap';

/** Dùng khi cú bấm không gắn với mẫu nào (header, footer, nút nổi...). */
const KHONG_CO_MA = '—';

/**
 * Khách bấm nút nhắn Zalo. Đây là "đích" của cả website — mọi thứ khác chỉ là
 * đường dẫn tới đây.
 */
export function trackZaloClick(viTri: ViTri, maSp?: string | null) {
  track('Bấm Zalo', { vi_tri: viTri, ma_sp: maSp || KHONG_CO_MA });
}

/** Khách bấm nút gọi. Tách riêng khỏi Zalo: hai kiểu khách rất khác nhau. */
export function trackCallClick(viTri: ViTri) {
  track('Bấm gọi', { vi_tri: viTri });
}

/**
 * Khách gõ tìm nhưng KHÔNG ra mẫu nào.
 *
 * Đây là sự kiện đáng giá nhất trong ba cái: nó là danh sách những thứ khách
 * đang hỏi mà tiệm chưa có — dùng thẳng cho khâu nhập hàng.
 *
 * Chỉ gọi sau khi khách ngừng gõ (xem ProductExplorer), không gọi theo phím.
 */
export function trackEmptySearch(tuKhoa: string, loai: string) {
  track('Tìm không ra mẫu', { tu_khoa: tuKhoa.slice(0, 120), loai });
}

/**
 * Khách CHỌN một giá trị lọc (không tính lúc bỏ chọn). Cho biết khách quan tâm
 * size nào, tầm giá nào — để biết nên nhập thêm gì và trưng mẫu nào lên trước.
 */
export function trackFilterUse(truong: string, giaTri: string) {
  track('Dùng bộ lọc', { truong, gia_tri: giaTri });
}
