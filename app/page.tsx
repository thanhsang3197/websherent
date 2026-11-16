import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import {
  getProducts,
  getRentalProducts,
  getAlbums,
  getFeedback,
  getUuDai,
} from '@/lib/products';
import {
  siteConfig,
} from '@/lib/site-config';
import { Hero } from '@/components/Hero';
import type { TheKenh, AnhKenh } from '@/components/TheoDoiTiem';
import { ProductExplorer } from '@/components/ProductExplorer';
import { UuDaiSection } from '@/components/UuDaiSection';
import { FeedbackSection } from '@/components/FeedbackSection';

/** "@ten" lấy từ link hồ sơ (instagram.com/ten/, tiktok.com/@ten). */
function handleTuLink(url: string): string {
  const ten = url.replace(/\/+$/, '').split('/').pop() ?? '';
  return ten.startsWith('@') ? ten : `@${ten}`;
}

/**
 * Thẻ "Theo dõi tiệm" trong hero: mỗi thẻ 3 ảnh mẫu đang cho thuê trên web
 * (chủ shop chọn 16/11/2026 — không lấy bài IG thật), tự đổi theo catalogue.
 * Không mẫu nào lặp giữa các thẻ.
 */
function buildTheKenh(thue: Product[]): TheKenh[] {
  const daDung = new Set<string>();
  const mau = (loc: (p: Product) => boolean): AnhKenh[] => {
    const ra: AnhKenh[] = [];
    for (const p of thue) {
      if (ra.length >= 3) break;
      if (!p.image || daDung.has(p.image) || !loc(p)) continue;
      daDung.add(p.image);
      ra.push({ src: p.image });
    }
    return ra;
  };
  const laAoDai = (p: Product) => p.category === 'ao-dai' || p.category === 'phap-phuc';
  const laVay = (p: Product) => p.category === 'dam-vay';
  const anhVay = mau(laVay);
  const anhAoDai = mau(laAoDai);
  const anhTiktok = mau((p) => p.category !== 'phu-kien');
  const anhFb = mau((p) => p.category !== 'phu-kien');

  return [
    {
      kenh: 'Instagram váy',
      nenTang: 'instagram',
      ten: 'IG Váy đầm',
      handle: handleTuLink(siteConfig.instagramUrl),
      href: siteConfig.instagramUrl,
      anh: anhVay,
    },
    {
      kenh: 'Instagram áo dài',
      nenTang: 'instagram',
      ten: 'IG Áo dài',
      handle: handleTuLink(siteConfig.instagramUrl2),
      href: siteConfig.instagramUrl2,
      anh: anhAoDai,
    },
    {
      kenh: 'TikTok',
      nenTang: 'tiktok',
      ten: 'TikTok',
      handle: handleTuLink(siteConfig.tiktokUrl),
      href: siteConfig.tiktokUrl,
      anh: anhTiktok,
    },
    {
      kenh: 'Facebook',
      nenTang: 'facebook',
      ten: 'Facebook · Messenger',
      handle: siteConfig.name.toUpperCase(),
      href: siteConfig.facebookUrl,
      anh: anhFb,
    },
  ];
}

export default async function HomePage() {
  // Gọi song song: hero và catalogue không phụ thuộc nhau, gọi nối tiếp là bắt
  // khách chờ thêm một vòng mạng vô ích.
  // `products` = đầy đủ (dùng cho khối Thanh lý), `thue` = danh mục cho thuê,
  // đã bỏ mẫu shop để "Chỉ hiện ở trang thanh lý".
  const [products, thue, albums, feedback, uuDai] = await Promise.all([
    getProducts(),
    getRentalProducts(),
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


  const theKenh = buildTheKenh(thue);

  return (
    <>
      {/* Slogan + 2 nút (bỏ ảnh lớn) + "Theo dõi tiệm" (thẻ kênh, 16/11/2026) + "Bạn đi dịp gì?" (album). */}
      <Hero albums={albums} kenh={theKenh} />

      {/*
        Ưu đãi shop đăng bên app (api-cong-khai.md §2.6) — ngay dưới hero để khách
        thấy trước khi cuộn tới sản phẩm (chủ shop chốt 06/10/2026). Rỗng -> ẩn
        cả khối. Thanh mỏng trên cùng mọi trang nằm ở app/layout.tsx.
      */}
      {/* ẩn trên điện thoại — thanh ưu đãi mỏng trên cùng đã có. */}
      <div className="hidden sm:block">
        <UuDaiSection items={uuDai.filter((u) => u.hienKhoi)} />
      </div>

      {/*
        bỏ khối "Sản phẩm mới về" khỏi trang chủ, không có nút
        lọc "Mới về" (chủ shop bỏ). Muốn bật lại nút: truyền `moiVeIds` cho
        ProductExplorer (lấy từ getNewArrivals).
      */}

      {/*
        Khối "Album tuyển chọn" đã bỏ khỏi trang chủ (16/11/2026): album đã có
        ở hàng "Bạn đi dịp gì?" trong hero, bỏ để bộ sưu tập lên cao hơn.
      */}

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
                      <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-accent-dark">
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
