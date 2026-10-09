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
  | 'thanh-ly'
  | 'header'
  | 'footer'
  | 'nut-noi'
  | 'gioi-thieu'
  | 'hoi-dap'
  | 'feedback'
  | 'uu-dai';

/** Dùng khi cú bấm không gắn với mẫu nào (header, footer, nút nổi...). */
const KHONG_CO_MA = '—';

/**
 * Khách bấm nút nhắn Zalo. Đây là "đích" của cả website — mọi thứ khác chỉ là
 * đường dẫn tới đây.
 */
export function trackZaloClick(viTri: ViTri, maSp?: string | null) {
  track('Bấm Zalo', { vi_tri: viTri, ma_sp: maSp || KHONG_CO_MA });
}

/** Khách bấm nút nhắn Messenger (Facebook) — kênh thứ hai cạnh Zalo. */
export function trackMessengerClick(viTri: ViTri, maSp?: string | null) {
  track('Bấm Messenger', { vi_tri: viTri, ma_sp: maSp || KHONG_CO_MA });
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

/* ─── Bổ sung 09/10/2026 — bốn câu hỏi app nội bộ đọc về màn Phân tích ─────
 * Tên sự kiện ở dưới phải khớp NGUYÊN VĂN bên app (route
 * `app/api/thong-ke-web/phan-tich`, lọc bằng `eventName eq '…'`). Đổi chữ nào
 * ở đây thì sửa bên đó, nếu không số bên app về 0 mà không báo gì.
 */

/** Ưu đãi bấm từ thanh trên cùng hay từ khối dưới ảnh đầu trang chủ. */
export type ViTriUuDai = 'thanh' | 'khoi';

/**
 * Khách bấm vào một chương trình ưu đãi. Gửi TIÊU ĐỀ chứ không gửi id: id là
 * uuid, đọc trên dashboard không ra chương trình nào.
 */
export function trackUuDaiClick(viTri: ViTriUuDai, tieuDe: string) {
  track('Bấm ưu đãi', { vi_tri: viTri, ten: tieuDe.slice(0, 80) });
}

/**
 * Khách mở video của một mẫu. Chỉ gọi ở lần mở ĐẦU TIÊN trên trang — bấm qua
 * lại giữa ảnh và video không tính thêm (mỗi sự kiện đều tốn tiền).
 */
export function trackVideoOpen(maSp: string, nenTang: string) {
  track('Xem video', { ma_sp: maSp, nen_tang: nenTang });
}

/** Album bấm từ khối trang chủ hay từ trang /album. */
export type ViTriAlbum = 'trang-chu' | 'trang-album';

export function trackAlbumOpen(tenAlbum: string, viTri: ViTriAlbum) {
  track('Mở album', { album: tenAlbum.slice(0, 80), vi_tri: viTri });
}

/** Kênh mạng xã hội — tiệm có HAI Instagram nên phải tách tên. */
export type KenhMxh = 'Instagram váy' | 'Instagram áo dài' | 'Facebook' | 'TikTok';

export function trackSocialClick(kenh: KenhMxh, viTri: ViTri) {
  track('Bấm mạng xã hội', { kenh, vi_tri: viTri });
}

/**
 * Khách CHÉP số điện thoại của tiệm (bôi đen rồi copy). Trên iPhone nhiều
 * khách chép số để dán vào Zalo thay vì bấm nút — cú đó không đi qua link nào
 * nên trước đây không đếm được. Xem `components/TheoDoiChepSo.tsx`.
 *
 * `trang` là đoạn đầu đường dẫn ('/' = trang chủ), không gửi cả đường dẫn để
 * dashboard không vỡ thành hàng trăm dòng theo từng mẫu.
 */
export function trackPhoneCopy(trang: string) {
  track('Chép SĐT', { trang });
}

/**
 * Sự kiện của một link nằm trong SERVER component — dạng dữ liệu thuần để
 * truyền qua ranh giới server → client (không truyền hàm được).
 * Xem `components/LinkCoSuKien.tsx`.
 */
export type SuKienLink =
  | { loai: 'uu-dai'; viTri: ViTriUuDai; tieuDe: string }
  | { loai: 'album'; viTri: ViTriAlbum; ten: string }
  | { loai: 'mxh'; viTri: ViTri; kenh: KenhMxh };

export function guiSuKienLink(s: SuKienLink) {
  if (s.loai === 'uu-dai') trackUuDaiClick(s.viTri, s.tieuDe);
  else if (s.loai === 'album') trackAlbumOpen(s.ten, s.viTri);
  else trackSocialClick(s.kenh, s.viTri);
}
