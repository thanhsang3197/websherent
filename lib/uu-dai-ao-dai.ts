import type { Product } from '@/types/product';
import { listRentPrice } from '@/lib/format';
import { NHOM_DAY_NGOC, nhomPhuKien } from '@/lib/mapping';
import { monTuSanPham, type MonTrongTui } from '@/lib/tui-do-mon';

/**
 * Ưu đãi "THUÊ ÁO DÀI, NHẬN NHIỀU ƯU ĐÃI" (16/11 – 31/12/2026), tính theo tổng
 * phí thuê ÁO DÀI trong túi đồ (không cộng pháp phục, phụ kiện):
 *   - từ 150K: tặng 1 phụ kiện từ 20K trở xuống, thuộc nhóm quạt, cài, kẹp,
 *     trâm, hoa, dây ngọc
 *   - từ 200K: tặng 1 phụ kiện áo dài bất kỳ
 *   - từ 300K: tặng 2 phụ kiện áo dài bất kỳ
 * Chủ shop chốt 15/11/2026: mỗi mốc chỉ lấy mốc cao nhất đạt được (không cộng
 * dồn); "bất kỳ" = chỉ phụ kiện áo dài. Chủ shop 16/11/2026: bill ĐÚNG bằng mốc
 * (150K, 200K, 300K) cũng được — tính "từ", không phải "trên".
 *
 * File THUẦN (không hook) để trang server lọc sẵn danh sách phụ kiện quà.
 */

/** Nhóm phụ kiện áo dài (khoá = nhomPhuKien), đúng thứ tự hiện ở gợi ý/bộ chọn quà. */
export const NHOM_AO_DAI = [
  'vh',
  'nón',
  'h',
  'k',
  'ô trắng',
  'c',
  'q',
  'guốc',
  'kẹp',
  'trâm',
  NHOM_DAY_NGOC,
];

/** Tên nhóm cho khách đọc. Nhóm chưa rõ tên món thì để nguyên mã. */
export const TEN_NHOM: Record<string, string> = {
  q: 'Quạt',
  c: 'Cài tóc',
  kẹp: 'Kẹp',
  trâm: 'Trâm',
  h: 'Hoa',
  [NHOM_DAY_NGOC]: 'Dây ngọc',
  nón: 'Nón',
  guốc: 'Guốc',
  'ô trắng': 'Dù',
  vh: 'Vòng hoa',
  k: 'Kiềng',
};

/** Nhóm của mốc 150K, xếp theo thứ tự khách hay chọn. */
const NHOM_MOC_NHO = ['q', 'c', 'kẹp', 'trâm', 'h', NHOM_DAY_NGOC];
const GIA_MOC_NHO = 20_000;

export const BAT_DAU = '2026-11-16';
export const KET_THUC = '2026-12-31';

export type KieuQua = 'nho' | 'bat-ky';
export interface MocAoDai {
  /** Bill áo dài TỪ mức này trở lên là đạt. */
  tren: number;
  soQua: number;
  kieu: KieuQua;
  /** Câu ngắn: "1 phụ kiện từ 20K trở xuống". */
  moTa: string;
}

export const MOC_AO_DAI: MocAoDai[] = [
  { tren: 150_000, soQua: 1, kieu: 'nho', moTa: '1 phụ kiện từ 20K trở xuống' },
  { tren: 200_000, soQua: 1, kieu: 'bat-ky', moTa: '1 phụ kiện bất kỳ' },
  { tren: 300_000, soQua: 2, kieu: 'bat-ky', moTa: '2 phụ kiện bất kỳ' },
];

/** Phụ kiện có thể làm quà — bản gọn để truyền xuống client. */
export interface PhuKienQua {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  nhom: string;
  /** Thuộc mốc 150K (nhóm nhỏ, giá ≤ 20K). */
  nho: boolean;
  /** Bản món để "thuê thêm" (trả tiền, có cọc) khi khách đã chọn đủ quà. */
  mon: MonTrongTui;
}

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD. */
function homNayVN(now: Date): string {
  return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
}

export function dangDienRa(now: Date = new Date()): boolean {
  const d = homNayVN(now);
  return d >= BAT_DAU && d <= KET_THUC;
}

/** Lọc + xếp phụ kiện áo dài có ảnh, theo thứ tự nhóm rồi số trong tên. */
export function phuKienLamQua(products: Product[]): PhuKienQua[] {
  const so = (ten: string) => Number(ten.match(/\d+/)?.[0] ?? 0);
  return products
    .filter((p) => p.category === 'phu-kien' && p.image)
    .map((p) => {
      const nhom = nhomPhuKien(p);
      const price = listRentPrice(p).price;
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        image: p.image as string,
        price,
        nhom,
        nho: NHOM_MOC_NHO.includes(nhom) && price > 0 && price <= GIA_MOC_NHO,
        mon: monTuSanPham(p),
      };
    })
    .filter((p) => NHOM_AO_DAI.includes(p.nhom) && p.price > 0)
    .sort(
      (a, b) =>
        thuTuNhom(a.nhom) - thuTuNhom(b.nhom) || so(a.name) - so(b.name) || a.name.localeCompare(b.name, 'vi'),
    );
}

/** Bộ chọn quà: nhóm mốc 150K đứng trước, rồi các nhóm còn lại. */
const THU_TU_CHON = [...NHOM_MOC_NHO, ...NHOM_AO_DAI.filter((n) => !NHOM_MOC_NHO.includes(n))];
function thuTuNhom(nhom: string): number {
  const i = THU_TU_CHON.indexOf(nhom);
  return i === -1 ? THU_TU_CHON.length : i;
}

export function laAoDai(m: MonTrongTui): boolean {
  if (m.category) return m.category === 'ao-dai';
  return /^AD/i.test(m.id);
}

/**
 * Tình trạng ưu đãi của túi: bill áo dài, mốc đang đạt, mốc kế tiếp và số tiền
 * còn thiếu tới mốc kế.
 */
export function tinhUuDaiAoDai(list: MonTrongTui[]) {
  const aoDai = list.filter(laAoDai);
  const bill = aoDai.reduce((a, m) => a + (m.price > 0 ? m.price : 0), 0);
  const moc = [...MOC_AO_DAI].reverse().find((m) => bill >= m.tren) ?? null;
  const mocKe = MOC_AO_DAI.find((m) => bill < m.tren) ?? null;
  const conThieu = mocKe ? mocKe.tren - bill : 0;
  return { soAoDai: aoDai.length, bill, moc, mocKe, conThieu };
}

/** Món quà hợp lệ với mốc đang đạt — bỏ món không đủ điều kiện, cắt theo số quà. */
export function quaHopLe(
  chon: string[],
  moc: MocAoDai | null,
  phuKien: PhuKienQua[],
  trongTui: Set<string>,
): PhuKienQua[] {
  if (!moc) return [];
  const theoMa = new Map(phuKien.map((p) => [p.id, p]));
  return chon
    .map((id) => theoMa.get(id))
    .filter((p): p is PhuKienQua => Boolean(p) && !trongTui.has(p!.id) && (moc.kieu === 'bat-ky' || p!.nho))
    .slice(0, moc.soQua);
}
