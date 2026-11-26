import { SITE_URL } from '@/lib/site-config';
import type { Product } from '@/types/product';

/**
 * IndexNow — báo cho Bing, Cốc Cốc, Yandex, Seznam… biết trang nào vừa đổi để
 * chúng thu thập lại NGAY, thay vì chờ vài ngày mới đọc lại sitemap.
 * Bing quan trọng vì ChatGPT tìm kiếm và Copilot lấy dữ liệu từ Bing.
 * (Google KHÔNG dùng IndexNow — Google vẫn đi theo sitemap + Search Console.)
 *
 * Khoá KHÔNG phải bí mật: nó nằm công khai ở /<khoá>.txt để các công cụ tìm
 * kiếm kiểm tra rằng người gửi đúng là chủ tên miền. Đổi tên miền thì giữ
 * nguyên khoá được, chỉ cần file khoá có ở tên miền mới.
 */
export const INDEXNOW_KEY = '514bb586f203ee7641cc7d28fd454b88';

/** Gửi một lần tới api.indexnow.org là đủ — nó chia lại cho mọi công cụ tham gia. */
const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** Trần của giao thức cho một lượt gửi. */
const TOI_DA_URL = 10_000;

/**
 * Gửi danh sách đường dẫn (dạng "/san-pham/abc") lên IndexNow.
 *
 * Không bao giờ ném lỗi: đây là việc phụ, hỏng thì công cụ tìm kiếm vẫn đọc
 * sitemap như cũ. Chỉ chạy trên bản production — preview/local mà báo thì gửi
 * nhầm tên miền tạm.
 */
export async function baoIndexNow(duongDan: string[]): Promise<number> {
  if (process.env.VERCEL_ENV !== 'production') return 0;

  const urlList = Array.from(new Set(duongDan))
    .slice(0, TOI_DA_URL)
    .map((d) => `${SITE_URL}${d}`);
  if (urlList.length === 0) return 0;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      cache: 'no-store',
      // Đừng để app nội bộ chờ lâu chỉ vì IndexNow chậm.
      signal: AbortSignal.timeout(5000),
    });
    // 200 = đã nhận, 202 = đã nhận và đang xác minh khoá. Còn lại là lỗi.
    if (res.status !== 200 && res.status !== 202) {
      console.error(`[indexnow] Bị từ chối: ${res.status} ${await res.text()}`);
      return 0;
    }
    return urlList.length;
  } catch (err) {
    console.error('[indexnow] Không gửi được:', err);
    return 0;
  }
}

/**
 * So catalogue cũ với mới, trả các đường dẫn cần báo: mẫu mới, mẫu đổi thông
 * tin, mẫu bị gỡ (để công cụ tìm kiếm thấy 404 mà bỏ khỏi kết quả). Có thay
 * đổi thì kèm trang chủ + thanh lý vì hai trang này liệt kê sản phẩm.
 *
 * Phụ kiện bị noindex nên không báo (xem app/san-pham/[slug]/page.tsx).
 */
export function duongDanDaDoi(cu: Product[], moi: Product[]): string[] {
  const vanTay = (p: Product) => JSON.stringify(p);
  const mapCu = new Map(cu.map((p) => [p.slug, p]));
  const mapMoi = new Map(moi.map((p) => [p.slug, p]));

  const doi: string[] = [];
  for (const [slug, p] of mapMoi) {
    if (p.category === 'phu-kien') continue;
    const truoc = mapCu.get(slug);
    if (!truoc || vanTay(truoc) !== vanTay(p)) doi.push(`/san-pham/${slug}`);
  }
  for (const [slug, p] of mapCu) {
    if (p.category !== 'phu-kien' && !mapMoi.has(slug)) doi.push(`/san-pham/${slug}`);
  }

  return doi.length > 0 ? ['/', '/thanh-ly', ...doi] : [];
}
