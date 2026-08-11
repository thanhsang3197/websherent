import 'server-only';
import type { Product } from '@/types/product';
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
      next: { revalidate },
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
