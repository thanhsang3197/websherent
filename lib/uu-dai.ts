/**
 * Chữ hiện cho khách về hạn của một ưu đãi. Thuần tính toán — dùng được cả ở
 * server lẫn client.
 */

/** Còn từng này ngày trở xuống mới đếm ngược; xa hơn thì chỉ nói ngày kết thúc. */
const DEM_NGUOC_TOI_DA = 14;

/** Hôm nay theo giờ Việt Nam, dạng `YYYY-MM-DD` — cùng múi giờ với API. */
export function homNayVN(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(now);
}

/** Số ngày từ `tu` tới `den` (cả hai `YYYY-MM-DD`). Âm = `den` đã qua. */
function soNgayGiua(tu: string, den: string): number {
  const ms = Date.parse(`${den}T00:00:00Z`) - Date.parse(`${tu}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** `2026-10-30` → `30/10`. */
function ngayThang(ngay: string): string {
  const m = ngay.match(/^\d{4}-(\d{2})-(\d{2})/);
  return m ? `${m[2]}/${m[1]}` : '';
}

/**
 * Đếm ngược khi đã gần hết hạn: "Còn 3 ngày", "Hôm nay là ngày cuối". `null`
 * khi không có ngày kết thúc, đã qua, hoặc còn xa (chưa cần giục khách).
 */
export function demNguoc(ketThuc: string | null, now: Date = new Date()): string | null {
  if (!ketThuc) return null;
  const con = soNgayGiua(homNayVN(now), ketThuc);
  if (con < 0 || con > DEM_NGUOC_TOI_DA) return null;
  return con === 0 ? 'Hôm nay là ngày cuối' : `Còn ${con} ngày`;
}

/**
 * Dòng hạn dưới tiêu đề thẻ: đếm ngược nếu gần hết hạn, không thì "Đến hết
 * 30/10". `null` = không có ngày kết thúc, không cần nói gì.
 */
export function nhanHan(ketThuc: string | null, now: Date = new Date()): string | null {
  if (!ketThuc) return null;
  const dem = demNguoc(ketThuc, now);
  if (dem) return dem;
  return `Đến hết ${ngayThang(ketThuc)}`;
}

/** Khoảng ngày đầy đủ cho trang thể lệ: "Từ 01/10 đến hết 30/10". */
export function khoangNgay(batDau: string | null, ketThuc: string | null): string | null {
  if (batDau && ketThuc) return `Từ ${ngayThang(batDau)} đến hết ${ngayThang(ketThuc)}`;
  if (ketThuc) return `Đến hết ${ngayThang(ketThuc)}`;
  if (batDau) return `Từ ${ngayThang(batDau)}`;
  return null;
}

/** Biểu tượng + màu theo loại ưu đãi. */
export interface KieuLoai {
  icon: string;
  /** Nhãn nhỏ (nền nhạt, chữ đậm cùng tông) — đọc rõ cả khi đè lên ảnh. */
  badge: string;
  /** Nền thẻ chữ khi không có poster. */
  nen: string;
  /** Màu chữ trên nền thẻ chữ. */
  chu: string;
}

/**
 * Mã loại (`uu_dai.loai` bên app) -> kiểu hiển thị. Class Tailwind viết nguyên
 * văn để JIT thấy. Ba màu ấm/nhạt hợp bảng màu kem–đất nung của web; loại lạ
 * (app thêm loại mới mà web chưa biết) rơi về `KHAC` chứ không vỡ.
 */
const KIEU_LOAI: Record<string, KieuLoai> = {
  VOUCHER: {
    icon: '🎟️',
    badge: 'bg-amber-100 text-amber-800',
    nen: 'from-amber-200/70 via-amber-50 to-surface',
    chu: 'text-amber-800',
  },
  GUI_ANH: {
    icon: '📸',
    badge: 'bg-rose-100 text-rose-800',
    nen: 'from-rose-200/70 via-rose-50 to-surface',
    chu: 'text-rose-800',
  },
  SU_KIEN: {
    icon: '🎉',
    badge: 'bg-emerald-100 text-emerald-800',
    nen: 'from-emerald-200/70 via-emerald-50 to-surface',
    chu: 'text-emerald-800',
  },
  THONG_BAO: {
    icon: '📢',
    badge: 'bg-sky-100 text-sky-800',
    nen: 'from-sky-200/70 via-sky-50 to-surface',
    chu: 'text-sky-800',
  },
  KHAC: {
    icon: '✨',
    badge: 'bg-accent/10 text-accent-dark',
    nen: 'from-accent/25 via-tint to-surface',
    chu: 'text-accent-dark',
  },
};

export function kieuLoai(loai: string): KieuLoai {
  return KIEU_LOAI[loai] ?? KIEU_LOAI.KHAC;
}
