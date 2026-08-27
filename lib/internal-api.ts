import 'server-only';
import type { Product, ProductSale } from '@/types/product';
import { normalizeImageUrl } from '@/lib/format';
import { buildProductSlug } from '@/lib/slug';
import { deriveCategory } from '@/lib/brands';

/**
 * ADAPTER KẾT NỐI VỚI WEBAPP NỘI BỘ (REST API).
 *
 * Lấy danh sách sản phẩm đang cho thuê từ hệ thống quản lý của tiệm.
 * Hợp đồng đầy đủ: `docs/api-cong-khai.md` trong repo Sherent-app.
 *
 * ---------------------------------------------------------------------------
 * ⚠️ API KHÔNG TRẢ LỊCH TRỐNG — VÀ ĐÓ LÀ CỐ Ý
 * ---------------------------------------------------------------------------
 * Chủ shop chốt 11/08/2026: không cho website biết món nào đang bận, vì đó là
 * thông tin kinh doanh (người ngoài đếm được tiệm đang chạy bao nhiêu đơn) và
 * suy ngược ra được lịch của từng khách.
 *
 * Nên file này KHÔNG còn hàm `fetchOrdersFromInternalApi`, và website cũng bỏ
 * hẳn phần "kiểm tra lịch trống". Khách hỏi thì nhắn Zalo, nhân viên tra trong
 * app rồi trả lời.
 *
 * Đừng dựng lại tính năng đó bằng cách đoán từ dữ liệu ở đây: API cũng đã thôi
 * đọc bảng đơn hàng, nên không có đường nào lấy được nữa.
 */

/**
 * Nhãn cache dùng chung cho MỌI lượt gọi catalogue.
 *
 * `app/api/lam-moi` gọi `revalidateTag(TAG_SAN_PHAM)` để xoá sạch cache ngay
 * khi app nội bộ báo có sản phẩm đổi. Dùng MỘT nhãn chung nên không phải liệt
 * kê từng trang — mà số trang lại đổi theo số món trong tiệm.
 */
export const TAG_SAN_PHAM = 'san-pham';

/** Số món mỗi lượt gọi. API chặn trần ở 100. */
const MOI_TRANG = 100;

/** Chặn vòng lặp vô hạn nếu API trả `con_nua` sai. Tiệm có ~314 món. */
const TOI_DA_SO_TRANG = 20;

export function isInternalApiConfigured(): boolean {
  return Boolean(process.env.INTERNAL_API_URL);
}

/** Một dòng sản phẩm đúng như API trả về. */
interface SanPhamApi {
  ma: string;
  ten: string;
  loai: string;
  thuong_hieu: string | null;
  co: string | null;
  gia_thue: number;
  tien_coc: number;
  anh: string | null;
  anh_phu: string[];

  // --- Thanh lý (pass mẫu) --- 3 trường dưới đây LÀ TUỲ CHỌN.
  // API cũ chưa có chúng; khi đó `sale` = null và trang /thanh-ly trống, chứ
  // website KHÔNG hỏng. Spec để bên app trả về: docs/ket-noi-webapp.md §5.
  /** Tiệm đang rao bán đứt mẫu này không. */
  dang_pass?: boolean | null;
  /** Giá bán đứt (VND). 0/null = chưa chốt giá -> web hiện "Liên hệ". */
  gia_pass?: number | null;
  /** Ghi chú tình trạng mẫu, vd "còn mới 95%". */
  ghi_chu_pass?: string | null;

  /**
   * Vị trí mẫu trên khung hero; null = không trưng bày.
   *
   * CHỈ ĐỌC ĐỂ BIẾT, KHÔNG DÙNG LÀM CHỈ SỐ MẢNG: đây không phải dãy 1,2,3 liên
   * tục — shop bỏ một mẫu ở giữa là để lại lỗ trống (api-cong-khai.md §2.1).
   * API đã trả đúng thứ tự shop sắp rồi, cứ giữ nguyên thứ tự mảng.
   */
  trung_bay_thu_tu?: number | null;

  /**
   * Vị trí trong khối "Sản phẩm mới về"; null = không nằm trong khối.
   * Cùng quy tắc với `trung_bay_thu_tu`: chỉ để biết, không dùng làm chỉ số.
   */
  moi_ve_thu_tu?: number | null;
}

interface TraVeApi {
  tong: number;
  trang: number;
  moi_trang: number;
  con_nua: boolean;
  san_pham: SanPhamApi[];
}

function mapCategory(
  loai: string,
  id: string,
  name: string,
  image: string | null,
): Product['category'] {
  const v = (loai || '').toUpperCase();
  if (v.includes('AO_DAI') || v.includes('AO-DAI')) return 'ao-dai';
  if (v.includes('PHAP_PHUC') || v.includes('PHAP-PHUC')) return 'phap-phuc';
  if (v.includes('GAM')) return 'gam';

  // App nội bộ CHƯA có loại "Gấm" trong cột `loai`, nên mẫu gấm hiện về đây
  // dưới dạng đầm/váy. Nhận thêm theo MÃ SP "G..." — đúng quy ước AD/PP đang
  // dùng bên Google Sheets. Chỉ nhặt ra trường hợp gấm, các phân loại khác giữ
  // nguyên để không xáo trộn dữ liệu sẵn có.
  if (deriveCategory(id, name, image) === 'gam') return 'gam';
  return 'dam-vay';
}

/**
 * Đọc thông tin thanh lý từ một dòng API. null = mẫu này chỉ cho thuê.
 *
 * Chấp nhận CẢ HAI cách khai bên app, để không phụ thuộc thứ tự triển khai:
 *  - Có cột `dang_pass`  -> lấy đúng cột đó (nhân viên tick/bỏ tick).
 *  - Chưa có cột đó      -> coi như "cứ điền giá pass > 0 là đang pass".
 *
 * Ngược lại, `dang_pass: false` LUÔN thắng: bỏ tick là mẫu biến khỏi trang
 * thanh lý ngay, kể cả khi ô giá cũ vẫn còn số — nhân viên hay quên xoá giá.
 */
function mapSale(item: SanPhamApi): ProductSale | null {
  const price = Number(item.gia_pass ?? 0);
  const safePrice = Number.isFinite(price) && price > 0 ? price : 0;

  const dangPass =
    item.dang_pass === true ||
    (item.dang_pass == null && safePrice > 0);
  if (!dangPass) return null;

  const note = (item.ghi_chu_pass ?? '').trim();
  return { price: safePrice, note: note || null };
}

function mapSanPham(item: SanPhamApi): Product {
  const id = String(item.ma ?? '').trim();
  const name = String(item.ten ?? '').trim();

  // API trả `co` là MỘT chuỗi ("Freesize", "M"), nhưng vài món ghi nhiều size
  // ngăn bằng dấu phẩy hoặc gạch chéo.
  const sizes = (item.co ?? '')
    .split(/[,;/]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const mainImage = normalizeImageUrl(item.anh ?? '') || '';
  const images = (item.anh_phu ?? [])
    .map((u) => normalizeImageUrl(u) || u)
    .filter(Boolean);
  if (mainImage && !images.includes(mainImage)) images.unshift(mainImage);

  return {
    id,
    slug: buildProductSlug(name, id),
    name,
    brand: item.thuong_hieu ?? null,
    sizes,
    category: mapCategory(item.loai, id, name, mainImage || null),
    rentPrice: Number(item.gia_thue ?? 0),
    depositPrice: Number(item.tien_coc ?? 0),
    image: mainImage,
    images: images.length > 0 ? images : mainImage ? [mainImage] : [],
    sale: mapSale(item),
  };
}

/**
 * Lấy TOÀN BỘ sản phẩm từ WebApp nội bộ.
 *
 * API phân trang và chặn trần 100 món mỗi lượt, nên phải duyệt hết các trang.
 * Bản trước gọi đúng một lần và chỉ nhận được trang đầu — website sẽ hiện
 * thiếu hơn hai phần ba catalogue mà trông vẫn như đang chạy đúng.
 */
export async function fetchProductsFromInternalApi(): Promise<Product[]> {
  const apiUrl = process.env.INTERNAL_API_URL;
  if (!apiUrl) throw new Error('Thiếu INTERNAL_API_URL');

  const base = `${apiUrl.replace(/\/$/, '')}/san-pham`;
  const revalidate = Number(process.env.API_REVALIDATE_SECONDS ?? '21600');

  const tatCa: Product[] = [];

  for (let trang = 1; trang <= TOI_DA_SO_TRANG; trang++) {
    const q = new URLSearchParams({
      trang: String(trang),
      moi_trang: String(MOI_TRANG),
    });

    const res = await fetch(`${base}?${q}`, {
      headers: { Accept: 'application/json' },
      // `revalidate` là lưới an toàn cho trường hợp app không báo được (deploy
      // hỏng, sai khoá, mạng chập chờn). Đường chính là `tags` — app nội bộ
      // gọi /api/lam-moi và cache bay ngay, không phải chờ hết hạn.
      next: { revalidate, tags: [TAG_SAN_PHAM] },
    });

    if (!res.ok) {
      // Ném lỗi thay vì trả về những gì đã lấy được: `lib/products.ts` bắt lỗi
      // rồi quay về mock-data. Trả về nửa vời thì website hiện một catalogue
      // thiếu món mà không ai biết là đang thiếu.
      throw new Error(`Internal API trả về mã lỗi ${res.status} (trang ${trang})`);
    }

    const data = (await res.json()) as TraVeApi;
    const rows = Array.isArray(data.san_pham) ? data.san_pham : [];
    tatCa.push(...rows.map(mapSanPham));

    if (!data.con_nua || rows.length === 0) break;
  }

  return tatCa;
}

/**
 * Lấy một danh sách do shop CHỌN THỦ CÔNG bên app (màn hình Trưng bày):
 * khung hero (`trung_bay`) và khối "Sản phẩm mới về" (`moi_ve`).
 *
 * Khác `fetchProductsFromInternalApi` ở ba điểm, theo api-cong-khai.md §2.1/§2.2:
 *
 *  1. KHÔNG phân trang — mấy danh sách này chỉ vài mẫu, gọi một lượt là đủ.
 *  2. KHÔNG sắp xếp lại, KHÔNG gộp size. API đã trả đúng thứ tự shop đặt; chạy
 *     qua `prepare()` như catalogue là phá đúng cái thứ tự shop vừa sắp.
 *  3. Danh sách RỖNG là chuyện bình thường (shop bỏ hết mẫu), không phải lỗi —
 *     nơi gọi phải có phương án dự phòng.
 *
 * Mẫu trong hai danh sách này chắc chắn có ảnh: app không cho chọn mẫu thiếu
 * ảnh, cũng không cho xoá ảnh của mẫu đang được chọn.
 */
async function fetchDanhSachShopChon(
  thamSo: 'trung_bay' | 'moi_ve',
  truongThuTu: 'trung_bay_thu_tu' | 'moi_ve_thu_tu',
  soMau: number,
): Promise<Product[]> {
  const apiUrl = process.env.INTERNAL_API_URL;
  if (!apiUrl) throw new Error('Thiếu INTERNAL_API_URL');

  const base = `${apiUrl.replace(/\/$/, '')}/san-pham`;
  const revalidate = Number(process.env.API_REVALIDATE_SECONDS ?? '21600');

  const q = new URLSearchParams({
    [thamSo]: '1',
    // API chặn trần 100; kẹp lại phòng khi số mẫu bị điền giá trị vô lý.
    moi_trang: String(Math.min(Math.max(Math.trunc(soMau) || 1, 1), 100)),
  });

  const res = await fetch(`${base}?${q}`, {
    headers: { Accept: 'application/json' },
    // Cùng nhãn với catalogue: app nội bộ đổi mẫu là gọi /api/lam-moi, cache
    // của mấy khối này bay theo luôn chứ không phải chờ hết hạn.
    next: { revalidate, tags: [TAG_SAN_PHAM] },
  });

  if (!res.ok) {
    throw new Error(`Internal API trả về mã lỗi ${res.status} (${thamSo})`);
  }

  const data = (await res.json()) as TraVeApi;
  const rows = Array.isArray(data.san_pham) ? data.san_pham : [];

  // CHỐT CHẶN QUAN TRỌNG — chỉ nhận dòng có trường thứ tự là SỐ.
  //
  // api-cong-khai.md §4: trừ `loai`, tham số lạ bị BỎ QUA và API vẫn trả 200
  // kèm danh sách bình thường. Nên khi app chưa triển khai tham số (đúng tình
  // trạng của `moi_ve` lúc viết đoạn này, 16/08/2026), lời gọi trên trả về mấy
  // món ĐẦU CATALOGUE — nhận nguyên si thì khối "mới về" lặng lẽ thành 4 mẫu áo
  // dài đầu bảng chữ cái, trông vẫn "chạy" nên không ai biết là đang sai.
  //
  // Lọc theo trường thứ tự phân biệt được hai trường hợp: shop thật sự chọn mẫu
  // thì trường này là số, còn API bỏ qua tham số thì nó null/không có -> danh
  // sách rỗng -> nơi gọi dùng phương án dự phòng.
  //
  // Khi app ship tính năng, đoạn này tự chạy đúng, không phải sửa gì.
  const daChon = rows.filter((r) => typeof r[truongThuTu] === 'number');

  // KHÔNG sắp lại theo trường thứ tự: API đã trả đúng thứ tự shop đặt, và số
  // này có lỗ trống nên dùng làm khoá sắp xếp là sai (§2.1).
  return daChon.map(mapSanPham);
}

/** Mẫu shop chọn TRƯNG BÀY ở khung hero (api-cong-khai.md §2.1). */
export function fetchHeroProductsFromInternalApi(
  soMau: number,
): Promise<Product[]> {
  return fetchDanhSachShopChon('trung_bay', 'trung_bay_thu_tu', soMau);
}

/** Mẫu shop chọn cho khối "Sản phẩm mới về" (api-cong-khai.md §2.2). */
export function fetchNewArrivalsFromInternalApi(
  soMau: number,
): Promise<Product[]> {
  return fetchDanhSachShopChon('moi_ve', 'moi_ve_thu_tu', soMau);
}
