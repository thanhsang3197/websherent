import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
  getFeedback,
  getRentalProducts,
} from '@/lib/products';
import { CATEGORY_LABELS } from '@/types/product';
import { formatVnd, saleLines, saleNoteLine } from '@/lib/format';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { productJsonLd, breadcrumbJsonLd, absoluteUrl } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ChiTietThue } from '@/components/ChiTietThue';
import { NutTrenAnh } from '@/components/NutTrenAnh';
import { monTuSanPham } from '@/lib/tui-do-mon';
import { ProductGallery } from '@/components/ProductGallery';
import { TieuDeMotDong } from '@/components/TieuDeMotDong';
import { ProductCarousel } from '@/components/ProductCarousel';
import { FeedbackGallery } from '@/components/FeedbackGallery';
import { GoiYPhuKien, coGoiYPhuKien } from '@/components/GoiYPhuKien';
import { resolveProductVideo } from '@/lib/video';

// ─── Vì sao 604.800 giây (7 ngày) chứ không phải 6 giờ ────────────────────
// Đây CHỈ LÀ LƯỚI AN TOÀN, không phải cách chính để website cập nhật. Đường
// chính là `/api/lam-moi`: app nội bộ gọi sau mỗi lần sửa sản phẩm hoặc đổi
// mẫu trưng bày, `revalidateTag` xoá cache trong vài giây. Đồng hồ này chỉ có
// việc khi đường chính hỏng (app deploy lỗi, sai khoá, mạng chập chờn).
//
// Đo trên Vercel ngày 28/08/2026 khi Fluid Active CPU chạm 3h49m/4h:
//   - 12 giờ gần nhất: 2.800 lượt dựng lại vì HẾT GIỜ, 0 lượt vì tag
//   - tức 76% tổng số lần chạy function là do cái lưới an toàn này
//   - mỗi trang bị chạm ~1 lần/56 phút, nên với hạn 5 phút thì LƯỢT NÀO cũng
//     quá hạn -> lượt nào cũng dựng lại
// Nâng lên 6 giờ cắt khoảng 80-85% số lần dựng lại mà không làm dữ liệu cũ đi.
//
// ─── Đo lại tối 28/08/2026, sau khi đã chạy ở mức 6 giờ ───────────────────
// Cái lưới an toàn vẫn là thứ tốn nhất, chỉ là ít hơn trước:
//   - 12 giờ gần nhất: 513 lượt chạy function, trải trên ~256 trang khác nhau
//     -> mỗi trang tự dựng lại khoảng 2 lần / 12 giờ, đúng nhịp 6 giờ
//   - 56 giây Active CPU / 12 giờ = 60% CPU của CẢ TÀI KHOẢN (app + web)
//   - trong khi Web Analytics chỉ đếm ~130 khách/ngày: phần lớn lượt dựng lại
//     đó là BOT quét catalogue, không phải khách thật
//
// Nâng 6 giờ -> 7 ngày cắt tiếp ~96% số lần dựng lại (ước còn ~5 giây CPU/12h).
//
// VÌ SAO KHÔNG ĐẶT HẲN `false` (không bao giờ tự hết hạn):
// `/api/lam-moi-web` bên app nội bộ BẮT HẾT LỖI RỒI BỎ QUA — cố ý, để website
// hỏng không chặn nhân viên lưu sản phẩm. Nghĩa là một cú báo trượt sẽ trượt
// TRONG IM LẶNG. Với `false` thì giá sai nằm trên web cho tới lần deploy sau,
// có thể là hàng tháng. Bảy ngày giữ được gần hết phần tiết kiệm (chênh với
// `false` chỉ khoảng 1 phút CPU/tháng) mà vẫn bảo đảm web TỰ LÀNH.
//
// ĐÁNH ĐỔI: nếu đường chính hỏng mà không ai biết, dữ liệu có thể cũ tới 7 ngày.
export const revalidate = 604800;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  const title = product.brand ? `${product.name} — ${product.brand}` : product.name;
  const description =
    `Cho thuê ${product.name}${product.brand ? ` (${product.brand})` : ''} tại ${siteConfig.name}, ` +
    `${siteConfig.address.district}. Phí thuê ${formatVnd(product.rentPrice)}` +
    `${product.sizes.length ? `, size ${product.sizes.join('/')}` : ''}. Nhắn Zalo để giữ mẫu.`;

  return {
    title,
    description,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/san-pham/${product.slug}`,
      images: product.image
        ? [{ url: product.image, alt: product.name }]
        : [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [siteConfig.ogImage],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [related, video, feedback, catalogue] = await Promise.all([
    getRelatedProducts(product, 8),
    resolveProductVideo(product.video),
    getFeedback(),
    // Chỉ trang có khối gợi ý phụ kiện mới cần; cùng cache với catalogue.
    coGoiYPhuKien(product.category) ? getRentalProducts() : Promise.resolve([]),
  ]);
  // Khách đã mặc ĐÚNG mẫu này — `getFeedback` đã quy mã size về mẫu đại diện.
  const daMac = feedback.filter((f) => f.mau?.slug === product.slug);
  const categoryLabel = CATEGORY_LABELS[product.category];
  const productUrl = `${SITE_URL}/san-pham/${product.slug}`;

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: categoryLabel, url: `${SITE_URL}/?loai=${product.category}#san-pham` },
    { name: product.name, url: productUrl },
  ]);

  return (
    <article className="container-content pb-4 sm:py-10">
      <JsonLd data={productJsonLd(product, productUrl)} id="ld-product" />
      <JsonLd data={breadcrumb} id="ld-breadcrumb-product" />

      {/* Breadcrumb hiển thị */}
      {/* Điện thoại: ẩn — ảnh tràn viền ở đầu trang đã có nút ← quay lại. */}
      <nav aria-label="Breadcrumb" className="hidden text-sm text-muted sm:block">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/?loai=${product.category}#san-pham`}
              className="hover:text-accent"
            >
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-6 sm:mt-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Ảnh — gallery. Điện thoại: tràn viền (-mx-5 bù lề container),
            theo bản demo 13/11/2026. */}
        {/* min-w-0: khung Instagram có bề rộng tối thiểu riêng, thiếu dòng này
            thì trên điện thoại nó nong cột lưới ra và trang bị cuộn ngang. */}
        <div className="-mx-5 flex min-w-0 justify-center sm:mx-0 lg:justify-start">
          <ProductGallery
            images={product.images}
            alt={product.name}
            video={video}
            maSp={product.id}
            lopPhu={<NutTrenAnh ten={product.name} veDanhSach={`/?loai=${product.category}#san-pham`} />}
          />
        </div>

        {/* Thông tin */}
        <div className="min-w-0">
          {/* Nhãn loại + Mới về / Hot */}
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-tint px-3 py-1 text-xs font-bold text-accent-dark">
              {categoryLabel}
            </span>
            {product.isNew && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-ink">Mới về</span>
            )}
            {product.hot && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-ink">Đang hot</span>
            )}
          </div>
          {/* Tên dài tự co chữ cho vừa một dòng; tên ngắn giữ cỡ gốc. */}
          <TieuDeMotDong className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            {product.name}
          </TieuDeMotDong>
          <p className="mt-1 text-sm text-muted">
            {[
              product.brand,
              product.sizes.length ? `Size ${product.sizes.join(' / ')}` : null,
              `Mã ${product.id}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {/* Chọn 1 / 3 ngày, cọc, giá tag, nút hành động (máy tính) + thanh
              dính đáy (điện thoại), nhắc ưu đãi 3 váy. Số ngày khách chọn đi
              theo vào túi đồ và tin nhắn gửi tiệm (chủ shop chốt 13/11/2026). */}
          <ChiTietThue
            mon={monTuSanPham(product)}
            gia1Ngay={product.rentPrice1Day ?? null}
            gia3Ngay={product.rentPrice}
            coc={product.depositPrice}
            giaTag={product.tagPrice ?? null}
          />

          {/* Mẫu đang pass: VẪN cho thuê như thường, chỉ báo thêm là bán được. */}
          {product.sale && (
            <div className="mt-4 max-w-md rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">
                Mẫu này đang pass
              </p>
              {/* Cùng câu chữ, cùng cỡ chữ với thẻ ở trang /thanh-ly. */}
              <div className="mt-1.5 space-y-0.5 text-sm font-medium text-accent-dark">
                {saleLines(product.sale.price, product.rentPrice).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {product.sale.note && (
                <p className="mt-1 text-sm text-muted">
                  {saleNoteLine(product.sale.note)}
                </p>
              )}
              <Link
                href="/thanh-ly"
                className="mt-2 inline-block text-sm font-medium text-accent-dark underline underline-offset-4 hover:text-accent"
              >
                Xem tất cả mẫu thanh lý
              </Link>
            </div>
          )}


          <GoiYPhuKien category={product.category} products={catalogue} />

          {/* Trước đây chỗ này là ô "kiểm tra lịch trống", rồi thành câu nhắc
              "Muốn biết mẫu này còn trống ngày bạn cần? Nhắn Zalo…". Cả hai đã
              bỏ theo yêu cầu chủ shop (11/08 và 16/09/2026) — website không hiện
              lịch bận; khách bấm "Đặt lịch" ngay phía trên để hỏi. */}
        </div>
      </div>

      {/* Ảnh khách thật mặc mẫu này — tác dụng chốt đơn mạnh nhất: khách thấy
          chiếc đầm ngoài đời trên người thật, không chỉ ảnh mẫu. */}
      {daMac.length > 0 && (
        <section className="mt-10 sm:mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl text-ink">Khách đã mặc mẫu này</h2>
            <Link
              href="/feedback"
              className="shrink-0 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
            >
              Xem tất cả feedback →
            </Link>
          </div>
          <div className="mt-6">
            <FeedbackGallery feedback={daMac.slice(0, 8)} />
          </div>
        </section>
      )}

      {/* Mẫu tương tự */}
      {related.length > 0 && (
        <section className="mt-10 sm:mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl text-ink">Mẫu tương tự</h2>
            {/* Mẫu tương tự giờ cùng loại (lib/products.ts) -> dẫn về trang
                chủ đã lọc sẵn loại đó để khách xem hết. */}
            <Link
              href={`/?loai=${product.category}#san-pham`}
              className="shrink-0 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
            >
              Xem tất cả {categoryLabel.toLowerCase()} →
            </Link>
          </div>
          <div className="mt-6">
            <ProductCarousel products={related} />
          </div>
        </section>
      )}
    </article>
  );
}
