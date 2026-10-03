import 'server-only';

/**
 * CỬA TRUY CẬP DỮ LIỆU DUY NHẤT của app.
 * RSC (page) và Route Handler đều gọi qua đây -> sau này đổi nguồn
 * (mock -> Google Sheets -> Supabase) chỉ sửa 1 file.
 */

import type { Product, ProductCategory } from '../types/product';
import type { HeroSlide } from '../types/hero';
import { siteConfig } from './site-config';
import { fetchProductsFromSheet, isSheetsConfigured } from './sheets';
import type { Album, AlbumChiTiet } from '../types/album';
import {
  fetchProductsFromInternalApi,
  fetchHeroProductsFromInternalApi,
  fetchHeroSlidesFromInternalApi,
  fetchNewArrivalsFromInternalApi,
  fetchAlbumsFromInternalApi,
  fetchAlbumFromInternalApi,
  fetchFeedbackFromInternalApi,
  isInternalApiConfigured,
} from './internal-api';
import type { Feedback } from '../types/feedback';
import { slugify } from './slug';
import {
  sortProductsForDisplay,
  groupProducts,
  groupingKey,
  cleanSizeFromName,
} from './mapping';
import { mockProducts } from './mock-data';
import { fitSize } from './brands';

/** Gộp mẫu nhiều size thành 1, rồi sắp xếp hiển thị. */
function prepare(products: Product[]): Product[] {
  return sortProductsForDisplay(groupProducts(products));
}

/**
 * Lấy toàn bộ sản phẩm (đã sort: có ảnh lên đầu, rồi theo tên).
 * Ưu tiên WebApp Nội Bộ -> Google Sheets -> Fallback mock-data.
 */
export function getProducts(): Promise<Product[]> | Product[] {
  if (isInternalApiConfigured()) {
    return fetchProductsFromInternalApi()
      .then((fromApi) => (fromApi.length > 0 ? prepare(fromApi) : prepare(mockProducts)))
      .catch((err) => {
        console.error('[products] Lỗi đọc WebApp Nội Bộ — dùng mock-data:', err);
        return prepare(mockProducts);
      });
  }

  if (isSheetsConfigured()) {
    return fetchProductsFromSheet()
      .then((fromSheet) => (fromSheet.length > 0 ? prepare(fromSheet) : prepare(mockProducts)))
      .catch((err) => {
        console.error('[products] Lỗi đọc Google Sheets — dùng mock-data:', err);
        return prepare(mockProducts);
      });
  }

  return prepare(mockProducts);
}

/**
 * Mẫu shop chọn TRƯNG BÀY ở khung hero, đúng thứ tự shop sắp bên app.
 *
 * Trả `[]` — KHÔNG ném lỗi — trong mọi trường hợp không lấy được: chưa nối app
 * nội bộ, API lỗi, hay shop chưa chọn mẫu nào. Hero là thứ đầu tiên khách nhìn
 * thấy, nên nơi gọi luôn có phương án tự chọn ảnh thay thế; để lỗi vọt lên là
 * hỏng cả trang chủ chỉ vì một khung ảnh.
 *
 * KHÔNG chạy qua `prepare()` (gộp size + sắp xếp) như catalogue — làm vậy là
 * phá đúng cái thứ tự shop vừa sắp trong app.
 */
export async function getHeroProducts(soMau: number): Promise<Product[]> {
  if (!isInternalApiConfigured()) return [];

  try {
    return await fetchHeroProductsFromInternalApi(soMau);
  } catch (err) {
    console.error(
      '[products] Lỗi đọc danh sách trưng bày — hero quay về cách chọn tự động:',
      err,
    );
    return [];
  }
}

/**
 * Slide cho khung hero — ĐƯỜNG CHÍNH kể từ 04/09/2026.
 *
 * Gọi endpoint `/hero` (api-cong-khai.md §2.3) để lấy CẢ ảnh tự do shop treo
 * (banner, ảnh studio) chứ không chỉ các mẫu.
 *
 * ---------------------------------------------------------------------------
 * VÌ SAO VẪN GIỮ ĐƯỜNG CŨ `?trung_bay=1` LÀM DỰ PHÒNG
 * ---------------------------------------------------------------------------
 * Web và app là hai project Vercel riêng, deploy độc lập. Bản app đang chạy
 * lúc viết đoạn này CHƯA có route `/hero` — gọi vào là nhận trang 404 dạng
 * HTML. Nếu hero chỉ biết một đường thì cú deploy này làm trắng khung ảnh đầu
 * trang cho tới khi ai đó nhớ ra phải deploy luôn repo app.
 *
 * Nên: `/hero` lỗi HOẶC trả rỗng thì rơi về danh sách trưng bày cũ, đúng như
 * §2.3 bảo đảm ("`?trung_bay=1` KHÔNG đổi gì cả và sẽ tiếp tục chạy").
 *
 * Gỡ nhánh dự phòng này được, nhưng chỉ sau khi app đã deploy bản có `/hero`
 * VÀ chạy migration `20260904120000_anh_hero.sql`.
 */
export async function getHeroSlides(soMau: number): Promise<HeroSlide[]> {
  if (!isInternalApiConfigured()) return [];

  try {
    const slides = await fetchHeroSlidesFromInternalApi();
    if (slides.length > 0) return slides.slice(0, soMau);
  } catch (err) {
    console.error(
      '[products] Lỗi đọc /hero — quay về danh sách trưng bày cũ:',
      err,
    );
  }

  // Dự phòng: danh sách trưng bày cũ, chỉ có mẫu (không có ảnh tự do).
  const trungBay = await getHeroProducts(soMau);
  return trungBay
    .filter((p) => p.image)
    .map((p) => ({
      kieu: 'san_pham' as const,
      url: p.image as string,
      alt: `Mẫu ${p.name}${p.brand ? ` — ${p.brand}` : ''} · ${siteConfig.name}`,
      caption: null,
      href: null,
    }));
}

/**
 * Mẫu shop chọn cho khối "Sản phẩm mới về" (api-cong-khai.md §2.2).
 *
 * Cùng nguyên tắc với `getHeroProducts`: trả `[]` thay vì ném lỗi, để một khối
 * phụ hỏng không kéo sập cả trang chủ. Rỗng thì nơi gọi ẨN CẢ KHỐI (kể cả tiêu
 * đề) — để tiêu đề đứng trên khoảng trắng thì trông như trang bị lỗi.
 */
export async function getNewArrivals(soMau: number): Promise<Product[]> {
  if (!isInternalApiConfigured()) return [];

  try {
    return await fetchNewArrivalsFromInternalApi(soMau);
  } catch (err) {
    console.error('[products] Lỗi đọc danh sách "mới về" — ẩn khối:', err);
    return [];
  }
}

/**
 * Danh sách mẫu tiệm đang PASS (bán đứt) — nguồn của trang `/thanh-ly`.
 *
 * Lọc ra từ chính catalogue cho thuê, KHÔNG phải một danh sách riêng: mẫu đang
 * pass vẫn cho thuê bình thường cho tới khi bán xong. Sắp xếp giá bán thấp ->
 * cao, mẫu chưa chốt giá (0 = "Liên hệ") xuống cuối.
 *
 * Trả [] khi API chưa có 3 trường `dang_pass/gia_pass/ghi_chu_pass`, hoặc khi
 * đang chạy bằng mock-data (fallback lúc API lỗi) — trang sẽ hiện trạng thái
 * trống thay vì bịa ra mẫu thanh lý không có thật.
 */
export async function getSaleProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((p) => p.sale)
    .sort((a, b) => {
      const pa = a.sale?.price ?? 0;
      const pb = b.sale?.price ?? 0;
      // Giá 0 ("Liên hệ") xuống cuối thay vì lên đầu như so sánh số thường.
      if (pa === 0 !== (pb === 0)) return pa === 0 ? 1 : -1;
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name, 'vi');
    });
}

/** Tìm 1 sản phẩm theo slug. null nếu không có. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

/**
 * Gợi ý mẫu tương tự. CHỈ lấy mẫu CÓ ẢNH (để khách xem được hình) và CÙNG LOẠI
 * với mẫu đang xem — đang xem áo dài thì chỉ gợi ý áo dài (chủ shop yêu cầu
 * 02/10/2026). Loại đó không còn mẫu nào khác thì mới lấy sang loại khác.
 * Sắp xếp ưu tiên:
 *   1) Cùng size (có chung ít nhất 1 size với mẫu đang xem)
 *   2) Phí thuê GẦN với mẫu đang xem nhất (khách xem mẫu 250k thấy mẫu
 *      200–300k trước, không bị nhảy sang mẫu đắt gấp đôi)
 *   3) Cùng thương hiệu
 *   (4) Còn bằng nhau thì theo tên cho ổn định)
 */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getProducts();
  const withImage = all.filter((p) => p.id !== product.id && p.image);
  const sameCategory = withImage.filter((p) => p.category === product.category);
  const candidates = sameCategory.length > 0 ? sameCategory : withImage;

  const mySizes = product.sizes.map(fitSize);
  const sharesSize = (p: Product) =>
    p.sizes.some((s) => mySizes.includes(fitSize(s)));
  const priceGap = (p: Product) => Math.abs(p.rentPrice - product.rentPrice);

  return candidates
    .sort((a, b) => {
      // 1) cùng size
      const aSize = sharesSize(a) ? 0 : 1;
      const bSize = sharesSize(b) ? 0 : 1;
      if (aSize !== bSize) return aSize - bSize;
      // 2) phí thuê gần nhất
      if (priceGap(a) !== priceGap(b)) return priceGap(a) - priceGap(b);
      // 3) cùng brand
      const aBrand = a.brand && a.brand === product.brand ? 0 : 1;
      const bBrand = b.brand && b.brand === product.brand ? 0 : 1;
      if (aBrand !== bBrand) return aBrand - bBrand;
      return a.name.localeCompare(b.name, 'vi');
    })
    .slice(0, limit);
}

/** Danh sách slug cho generateStaticParams (SSG mọi trang chi tiết). */
export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}

/** Đếm số sản phẩm theo loại (dùng cho nội dung/summary). */
export function countByCategory(
  products: Product[],
): Record<ProductCategory, number> {
  return products.reduce(
    (acc, p) => {
      acc[p.category] += 1;
      return acc;
    },
    { 'ao-dai': 0, 'dam-vay': 0, 'phap-phuc': 0, gam: 0, 'phu-kien': 0 } as Record<
      ProductCategory,
      number
    >,
  );
}

/**
 * Danh sách album đang hiện trên web (api-cong-khai.md §2.4), đúng thứ tự shop.
 *
 * Trả `[]` — KHÔNG ném lỗi — khi không lấy được: chưa nối app nội bộ, API lỗi,
 * hay bản app đang chạy chưa có tính năng album (gọi vào nhận 404). Mọi nơi
 * dùng danh sách này (khối trang chủ, mục menu, sitemap) đều ẨN khi rỗng, nên
 * một cú lỗi ở đây chỉ làm mất khối album chứ không kéo sập trang.
 */
export async function getAlbums(): Promise<Album[]> {
  if (!isInternalApiConfigured()) return [];

  try {
    return await fetchAlbumsFromInternalApi();
  } catch (err) {
    console.error('[products] Lỗi đọc danh sách album — ẩn album:', err);
    return [];
  }
}

/**
 * Một album và các mẫu của nó, đã gộp size, GIỮ thứ tự shop sắp bên app.
 *
 * `null` = không có album này (slug sai, album bị xoá/ẩn/rỗng, hoặc chưa nối
 * app) -> trang gọi `notFound()`. Lỗi hệ thống thì NÉM, để Next giữ bản trang
 * cũ còn tốt thay vì lưu đè một trang báo lỗi vào cache 7 ngày.
 *
 * Hai bước bắt buộc theo §2.4, theo đúng thứ tự:
 *  1. Tải HẾT các trang rồi mới gộp size (fetchAlbumFromInternalApi lo phần tải).
 *  2. `groupProducts` giữ thứ tự nhóm theo phần tử xuất hiện đầu tiên, và KHÔNG
 *     gọi `sortProductsForDisplay` sau đó — sắp lại là đá mất mẫu shop ghim đầu.
 *
 * Bước thêm (spec chưa nhắc): mỗi thẻ được THAY bằng đúng mẫu tương ứng trong
 * catalogue, khớp theo khoá gộp size. Lý do: slug trang chi tiết dựng từ mã của
 * size NHỎ NHẤT trong nhóm. Album chỉ có `Fiona L` thì gộp riêng ra mã của L,
 * lệch với trang chi tiết (dựng từ mã của S) -> bấm vào là 404. Lấy bản trong
 * catalogue thì link đúng, và thẻ hiện đủ mọi size tiệm đang có như ở trang chủ.
 */
export async function getAlbum(slug: string): Promise<AlbumChiTiet | null> {
  if (!isInternalApiConfigured()) return null;

  const [data, catalogue] = await Promise.all([
    fetchAlbumFromInternalApi(slug),
    getProducts(),
  ]);
  if (!data) return null;

  const theoKhoa = new Map(catalogue.map((p) => [groupingKey(p), p]));
  const products = groupProducts(data.products).map(
    (p) => theoKhoa.get(groupingKey(p)) ?? p,
  );

  return { album: data.album, products };
}

/** "2026-09" -> "Tháng 9/2026". Sai khuôn -> null. */
function inThang(thang: string | null): string | null {
  const m = (thang ?? '').match(/^(\d{4})-(\d{2})$/);
  return m ? `Tháng ${Number(m[2])}/${m[1]}` : null;
}

/**
 * Feedback của khách đang hiện trên web (api-cong-khai.md §2.5), mới nhất trước.
 *
 * Trả `[]` — KHÔNG ném lỗi — khi không lấy được, cùng nguyên tắc `getAlbums`:
 * mọi khối feedback đều ẨN khi rỗng, nên lỗi ở đây chỉ làm mất khối đó.
 *
 * ĐỐI CHIẾU MẪU: API trả mã SP chưa gộp size (vd T002 = size M), trong khi web
 * chỉ có trang cho mẫu ĐẠI DIỆN sau khi gộp (thường là mã size S). Nên tìm theo
 * mã trước, không thấy thì theo tên đã bỏ size — đúng phần tên trong khoá gộp
 * `groupingKey`. Vẫn không thấy thì bỏ link, không đoán bừa.
 */
export async function getFeedback(): Promise<Feedback[]> {
  if (!isInternalApiConfigured()) return [];

  try {
    const [rows, products] = await Promise.all([
      fetchFeedbackFromInternalApi(),
      getProducts(),
    ]);
    if (rows.length === 0) return [];

    const theoMa = new Map(products.map((p) => [p.id.toUpperCase(), p]));
    const theoTen = new Map<string, Product>();
    for (const p of products) {
      const k = slugify(cleanSizeFromName(p.name));
      if (!theoTen.has(k)) theoTen.set(k, p);
    }

    return rows.map((r) => {
      const sp =
        (r.ma && theoMa.get(r.ma.toUpperCase())) ||
        (r.ten_mau && theoTen.get(slugify(cleanSizeFromName(r.ten_mau)))) ||
        null;
      return {
        id: r.id,
        anh: r.anh,
        anhTinNhan: r.anh_tin_nhan,
        loiKhach: r.loi_khach?.trim() || null,
        tenHienThi: r.ten_hien_thi?.trim() || null,
        dip: r.dip,
        dipTen: r.dip_ten,
        thang: inThang(r.thang),
        mau: sp ? { slug: sp.slug, ten: sp.name } : null,
        instagram: r.instagram,
        noiBatThuTu: typeof r.noi_bat_thu_tu === 'number' ? r.noi_bat_thu_tu : null,
        nangTho: r.nang_tho === true,
      };
    });
  } catch (err) {
    console.error('[products] Lỗi đọc feedback — ẩn các khối feedback:', err);
    return [];
  }
}
