import 'server-only';
import type { Product, ProductSale } from '@/types/product';
import { normalizeImageUrl } from '@/lib/format';
import { buildProductSlug } from '@/lib/slug';

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
}

interface TraVeApi {
  tong: number;
  trang: number;
  moi_trang: number;
  con_nua: boolean;
  san_pham: SanPhamApi[];
}

function mapCategory(loai: string): Product['category'] {
  const v = (loai || '').toUpperCase();
  if (v.includes('AO_DAI') || v.includes('AO-DAI')) return 'ao-dai';
  if (v.includes('PHAP_PHUC') || v.includes('PHAP-PHUC')) return 'phap-phuc';
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
    category: mapCategory(item.loai),
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
  const revalidate = Number(process.env.API_REVALIDATE_SECONDS ?? '300');

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
