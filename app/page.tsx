import Link from 'next/link';
import type { Product } from '@/types/product';
import type { HeroSlide } from '@/types/hero';
import {
  getProducts,
  getHeroSlides,
  getNewArrivals,
  countByCategory,
} from '@/lib/products';
import {
  siteConfig,
  promoBanner,
  heroConfig,
  SO_MAU_MOI_VE,
} from '@/lib/site-config';
import { Hero } from '@/components/Hero';
import { ProductExplorer } from '@/components/ProductExplorer';
import { Brand } from '@/components/Brand';
import { PromoBanner } from '@/components/PromoBanner';
import { NewArrivalsSection } from '@/components/NewArrivalsSection';

/**
 * Chọn slide cho hero, theo thứ tự ưu tiên:
 *  1. Mã SP ghim cứng trong heroConfig.productIds -> dùng đúng các mẫu đó.
 *     Đây là lối thoát hiểm khi cần ghim gấp mà không mở app; để rỗng là bỏ qua.
 *  2. Danh sách shop sắp ở màn hình "Trưng bày" bên app -> ĐƯỜNG CHÍNH.
 *     Gồm CẢ ảnh tự do (banner, ảnh studio) chứ không chỉ các mẫu — xem
 *     `getHeroSlides`. Giữ nguyên thứ tự API trả về.
 *  3. Tự động lấy mẫu của heroConfig.fallbackBrand.
 *  4. Vẫn không có -> mẫu bất kỳ có ảnh, để hero không bao giờ trống.
 *
 * Ba bước cuối là lưới an toàn cho tình huống api-cong-khai.md §2.1 cảnh báo:
 * shop bỏ hết mẫu trưng bày thì danh sách rỗng, và nếu trang chủ không lường
 * trước thì khách mở web ra thấy một khoảng trắng ngay đầu trang.
 *
 * Lưu ý: mã SP ở bước 1 là mã của mẫu SAU KHI gộp size. Mẫu nhiều size được gộp
 * về mã của size nhỏ nhất (vd Amy Dress S+M -> chỉ còn mã T001), nên dùng mã đó.
 */
function buildHeroSlides(
  products: Product[],
  tuApp: HeroSlide[],
): HeroSlide[] {
  const slides: HeroSlide[] = [];
  const seen = new Set<string>();

  const add = (p: Product) => {
    if (!p.image || seen.has(p.image) || slides.length >= heroConfig.maxSlides) return;
    seen.add(p.image);
    slides.push({
      url: p.image,
      alt: `Mẫu ${p.name}${p.brand ? ` — ${p.brand}` : ''} · ${siteConfig.name}`,
      caption: null,
      href: null,
    });
  };

  // 1. Mã SP được ghim thủ công.
  for (const code of heroConfig.productIds) {
    const wanted = code.trim().toUpperCase();
    const found = products.find((p) => p.id.toUpperCase() === wanted);
    if (found) add(found);
  }
  if (slides.length > 0) return slides;

  // 2. Danh sách shop sắp bên app (mẫu + ảnh tự do). KHÔNG sắp lại — API đã
  //    trả đúng thứ tự shop kéo–thả.
  for (const s of tuApp) {
    if (seen.has(s.url) || slides.length >= heroConfig.maxSlides) break;
    seen.add(s.url);
    slides.push(s);
  }
  if (slides.length > 0) return slides;

  // 3. Tự động theo brand.
  for (const p of products) {
    if (p.brand === heroConfig.fallbackBrand) add(p);
  }
  if (slides.length > 0) return slides;

  // 4. Cùng lắm: mẫu bất kỳ có ảnh.
  const any = products.find((p) => p.image);
  if (any) add(any);
  return slides;
}

export default async function HomePage() {
  // Gọi song song: hero và catalogue không phụ thuộc nhau, gọi nối tiếp là bắt
  // khách chờ thêm một vòng mạng vô ích.
  const [products, heroTuApp, moiVe] = await Promise.all([
    getProducts(),
    getHeroSlides(heroConfig.maxSlides),
    getNewArrivals(SO_MAU_MOI_VE),
  ]);
  const counts = countByCategory(products);

  const heroSlides = buildHeroSlides(products, heroTuApp);

  return (
    <>
      <Hero slides={heroSlides} productCount={products.length} counts={counts} />

      {/* Hàng mới shop tự chọn bên app. Rỗng -> component tự ẩn cả khối. */}
      <NewArrivalsSection products={moiVe} />

      {/*
        Banner khuyến mãi (bật ở lib/site-config.ts) vẫn nằm trên đầu — đây là
        tin thời vụ, để dưới cùng thì khách không kịp thấy.
        Còn đoạn giới thiệu "Về SHERENT" đã chuyển xuống CUỐI trang (chủ shop
        chốt 16/08/2026: khách vào trang phải thấy sản phẩm càng nhanh càng tốt).
      */}
      {promoBanner.enabled && <PromoBanner />}

      {/*
        Mục "Quy trình thuê" (3 bước + nút liên hệ) đã bỏ hẳn 16/08/2026 theo
        yêu cầu chủ shop: khách vào trang chủ là thấy ngay bộ sưu tập. Nội dung
        quy trình vẫn còn ở /cau-hoi-thuong-gap và /gioi-thieu.
      */}

      {/* Bộ sưu tập + bộ lọc */}
      <section id="san-pham" className="container-content scroll-mt-24 py-16">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
            Bộ sưu tập
          </p>
          <h2 className="mt-3 font-serif text-3xl text-accent-dark sm:text-4xl">
            Chọn mẫu bạn thích
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Từng đường may, từng chất liệu đều được chọn lọc kỹ càng — lướt qua
            bộ sưu tập và tìm chiếc đầm khiến bạn phải dừng lại. Bấm vào mẫu
            ưng ý để xem trọn bộ ảnh, giá thuê, giá cọc và giữ mẫu ngay.
          </p>
        </header>

        <ProductExplorer products={products} />
      </section>

      {/* Giới thiệu tiệm — đặt cuối trang, sau khi khách xem xong bộ sưu tập.
          Nội dung này phục vụ SEO/GEO là chính nên không cần nằm trên đầu. */}
      <section className="container-content pb-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
            Về {siteConfig.name}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-accent-dark sm:text-4xl">
            Tiệm cho thuê đầm, váy &amp; áo dài tại {siteConfig.address.district}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            <Brand /> tuyển chọn các mẫu đầm, váy dự tiệc và áo dài thiết
            kế đa dạng size, phù hợp đi tiệc, chụp ảnh, dự sự kiện, cưới hỏi và
            Tết. Hiện có <strong className="text-ink">{counts['dam-vay']}</strong>{' '}
            mẫu đầm &amp; váy và <strong className="text-ink">{counts['ao-dai']}</strong>{' '}
            mẫu áo dài để bạn thoải mái lựa chọn. Xem mẫu ngay trên trang này rồi
            nhắn Zalo để giữ mẫu — không cần dùng Instagram&nbsp;hay&nbsp;Facebook.
          </p>
          <Link
            href="/gioi-thieu"
            className="mt-5 inline-block text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
          >
            Tìm hiểu thêm về tiệm →
          </Link>
        </div>
      </section>
    </>
  );
}
