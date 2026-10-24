import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { HeroSlide } from '@/types/hero';
import {
  getProducts,
  getRentalProducts,
  getHeroSlides,
  getNewArrivals,
  getAlbums,
  getFeedback,
  getUuDai,
} from '@/lib/products';
import {
  siteConfig,
  heroConfig,
  SO_MAU_MOI_VE,
} from '@/lib/site-config';
import { Hero } from '@/components/Hero';
import { ProductExplorer } from '@/components/ProductExplorer';
import { UuDaiSection } from '@/components/UuDaiSection';
import { NewArrivalsSection } from '@/components/NewArrivalsSection';
import { AlbumSection } from '@/components/AlbumSection';
import { FeedbackSection } from '@/components/FeedbackSection';

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
      kieu: 'san_pham',
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
  // `products` = đầy đủ (dùng cho khối Thanh lý), `thue` = danh mục cho thuê,
  // đã bỏ mẫu shop để "Chỉ hiện ở trang thanh lý".
  const [products, thue, heroTuApp, moiVe, albums, feedback, uuDai] = await Promise.all([
    getProducts(),
    getRentalProducts(),
    getHeroSlides(heroConfig.maxSlides),
    getNewArrivals(SO_MAU_MOI_VE),
    getAlbums(),
    getFeedback(),
    getUuDai(),
  ]);
  // Mẫu đang pass lọc thẳng từ catalogue — y như getSaleProducts(), khỏi gọi lại.
  const salePrices = products.filter((p) => p.sale).map((p) => p.sale?.price ?? 0);
  const saleCount = salePrices.length;
  const pricedSales = salePrices.filter((price) => price > 0); // 0 = chưa chốt giá
  const minSalePrice = pricedSales.length ? Math.min(...pricedSales) : 0;
  // Ảnh mẫu kèm khối Thanh lý: ưu tiên mẫu rẻ nhất có ảnh, tối đa 3.
  const saleThumbs = products
    .filter((p) => p.sale && p.image)
    .sort((a, b) => (a.sale?.price || Infinity) - (b.sale?.price || Infinity))
    .slice(0, 3);

  const heroSlides = buildHeroSlides(thue, heroTuApp);

  return (
    <>
      <Hero slides={heroSlides} />

      {/*
        Ưu đãi shop đăng bên app (api-cong-khai.md §2.6) — ngay dưới hero để khách
        thấy trước khi cuộn tới sản phẩm (chủ shop chốt 06/10/2026). Rỗng -> ẩn
        cả khối. Thanh mỏng trên cùng mọi trang nằm ở app/layout.tsx.
      */}
      <UuDaiSection items={uuDai.filter((u) => u.hienKhoi)} />

      {/* Hàng mới shop tự chọn bên app. Rỗng -> component tự ẩn cả khối. */}
      <NewArrivalsSection products={moiVe} />

      {/* Album shop dựng bên app (api-cong-khai.md §2.4). Rỗng -> ẩn cả khối. */}
      <AlbumSection albums={albums} />

      {/*
        Mục "Quy trình thuê" (3 bước + nút liên hệ) đã bỏ hẳn 16/08/2026 theo
        yêu cầu chủ shop: khách vào trang chủ là thấy ngay bộ sưu tập. Nội dung
        quy trình vẫn còn ở /cau-hoi-thuong-gap và /gioi-thieu.
      */}

      {/* Bộ sưu tập + bộ lọc */}
      <section id="san-pham" className="container-content scroll-mt-28 pb-16 pt-5 sm:pt-16">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
            Bộ sưu tập
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            Chọn mẫu bạn thích
          </h2>
        </header>

        <ProductExplorer products={thue} />
      </section>

      {/* Ảnh khách mặc đồ (api-cong-khai.md §2.5) — dưới bộ sưu tập, trên mục
          Thanh lý (chủ shop 04/10/2026). Rỗng -> ẩn cả khối. */}
      <FeedbackSection feedback={feedback} />

      {/*
        Giới thiệu mục Thanh lý — cuối trang, sau khi khách xem xong bộ sưu tập.
        Thay cho đoạn "Về SHERENT" theo yêu cầu chủ shop 16/09/2026 (nội dung
        giới thiệu tiệm vẫn còn ở /gioi-thieu). Không có mẫu nào đang pass thì
        ẩn hẳn, khỏi dẫn khách sang một trang trống.
      */}
      {saleCount > 0 && (
        <section className="container-content pb-16">
          {/*
            Cả khối là một link lớn (23/10/2026): khung màu đất nung nhạt, giá
            "chỉ từ" in to, kèm ảnh vài mẫu đang pass để khách thấy ngay là có
            hàng thật — chữ trơn như trước khách cuộn qua không để ý.
          */}
          <Link
            href="/thanh-ly"
            className="group grid items-center gap-6 overflow-hidden rounded-2xl border border-accent/25 bg-accent/[0.07] p-5 transition-shadow hover:shadow-glass-hover sm:p-8 md:grid-cols-[1fr_auto] md:gap-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                Thanh lý · {saleCount} mẫu
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                Sản phẩm thanh lý
              </h2>
              {minSalePrice > 0 && (
                <p className="mt-3 text-ink">
                  chỉ từ{' '}
                  <strong className="text-3xl font-bold tracking-tight text-accent-dark sm:text-4xl">
                    {minSalePrice.toLocaleString('vi-VN')}&nbsp;đ
                  </strong>
                </p>
              )}
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/80">
                Mẫu tiệm pass lại, mua đứt mang về. Bấm để xem toàn bộ danh sách.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-dark px-5 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-accent">
                Xem các mẫu đang thanh lý
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>

            {saleThumbs.length > 0 && (
              <div className="flex gap-2.5 sm:gap-3">
                {saleThumbs.map((p) => (
                  <div
                    key={p.id}
                    className="relative aspect-[3/4] w-[30%] overflow-hidden rounded-xl bg-surface/60 md:w-24 min-[900px]:w-32 xl:w-36"
                  >
                    <Image
                      src={p.image!}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 30vw, 9rem"
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                    {(p.sale?.price ?? 0) > 0 && (
                      <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-accent-dark">
                        {p.sale!.price.toLocaleString('vi-VN')}&nbsp;đ
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Link>
        </section>
      )}
    </>
  );
}
