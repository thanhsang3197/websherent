/**
 * Tính toán & kiểu hiển thị cho trang /hang-thanh-vien. Thuần tính toán —
 * dùng được cả ở server lẫn client (ô "Bạn đang ở hạng nào?").
 */
import type { HangKhach } from '@/types/hang-khach';

/**
 * Màu thẻ của từng hạng, lấy từ chính tên hạng: bạc, vàng, ánh băng của kim
 * cương. Hạng khởi đầu mang màu nền nhấn của web. Viết mã hex nguyên văn (không
 * qua class Tailwind) vì nền hero đổi màu theo thẻ đang chọn bằng style inline.
 */
export interface MauHang {
  /** Nền thẻ / nền khối. */
  nen: string;
  /** Tông đậm hơn một bậc — lỗ xỏ dây của nhãn, ô màu nhỏ. */
  dam: string;
}

const MAU_MOI: MauHang = { nen: '#E8D5C7', dam: '#C9AE9A' };

/** Theo `ma` (cố định, không đổi khi shop đổi tên hiển thị). */
const MAU_THEO_MA: Record<string, MauHang> = {
  'Thân thiết': { nen: '#DEDBD5', dam: '#B9B4AB' },
  VIP: { nen: '#EBD39C', dam: '#C9A75A' },
  'VIP Kim Cương': { nen: '#D3E0E3', dam: '#9DB6BC' },
};

/** Mã lạ (app thêm hạng mới) thì rơi về màu theo thứ tự. */
const MAU_THEO_THU_TU = [MAU_THEO_MA['Thân thiết'], MAU_THEO_MA.VIP, MAU_THEO_MA['VIP Kim Cương']];

export function mauHang(hang: Pick<HangKhach, 'ma' | 'thuTu'> | null): MauHang {
  if (!hang) return MAU_MOI;
  return MAU_THEO_MA[hang.ma] ?? MAU_THEO_THU_TU[(hang.thuTu - 1) % 3] ?? MAU_MOI;
}

export const TEN_HANG_MOI = 'Thành viên mới';

const so = (n: number) => n.toLocaleString('vi-VN');

/** "1.000 điểm và 2 lượt thuê" — hoặc chỉ phần điểm khi hạng không xét lượt. */
export function dieuKien(hang: HangKhach): string {
  return hang.luotToiThieu
    ? `${so(hang.diemToiThieu)} điểm và ${hang.luotToiThieu} lượt thuê`
    : `${so(hang.diemToiThieu)} điểm`;
}

/** Một quyền lợi trong bảng: tên bên trái, giá trị bên phải. */
export interface DongQuyenLoi {
  ten: string;
  giaTri: string;
  ghiChu?: string;
}

/** Các dòng quyền lợi của một hạng, dựng từ các trường có cấu trúc. */
export function dongQuyenLoi(hang: HangKhach): DongQuyenLoi[] {
  const dong: DongQuyenLoi[] = [];
  if (hang.giamPhanTram > 0) {
    dong.push({ ten: 'Giảm phí thuê', giaTri: `${hang.giamPhanTram}%`, ghiChu: 'Tự trừ vào đơn ở quầy' });
  }
  if (hang.freePhuKien) {
    dong.push({ ten: 'Thuê phụ kiện', giaTri: 'Miễn phí' });
  }
  for (const q of hang.quyenLoiKhac) dong.push({ ten: q, giaTri: 'Có' });
  return dong;
}

/** Kết quả ô tính hạng. */
export interface KetQuaHang {
  /** Hạng hiện tại; `null` = thành viên mới. */
  hienTai: HangKhach | null;
  /** Hạng kế tiếp; `null` = đã ở hạng cao nhất. */
  ke: HangKhach | null;
  diem: number;
  /** Còn thiếu bao nhiêu để lên hạng kế (0 = đã đủ phần đó). */
  thieuDiem: number;
  thieuLuot: number;
}

/**
 * Hạng ứng với số phí thuê và số lượt đã trả đồ. Điều kiện là đủ điểm VÀ đủ
 * lượt (§2.7) — đủ một nửa thì chưa lên.
 */
export function tinhHang(
  dsHang: HangKhach[],
  dongMoiDiem: number,
  phiThue: number,
  luot: number,
): KetQuaHang {
  const diem = Math.floor(Math.max(0, phiThue) / dongMoiDiem);
  const dat = (h: HangKhach) => diem >= h.diemToiThieu && luot >= (h.luotToiThieu ?? 0);

  let hienTai: HangKhach | null = null;
  for (const h of dsHang) if (dat(h)) hienTai = h;

  const ke = dsHang.find((h) => h.thuTu > (hienTai?.thuTu ?? 0)) ?? null;
  return {
    hienTai,
    ke,
    diem,
    thieuDiem: ke ? Math.max(0, ke.diemToiThieu - diem) : 0,
    thieuLuot: ke ? Math.max(0, (ke.luotToiThieu ?? 0) - luot) : 0,
  };
}
