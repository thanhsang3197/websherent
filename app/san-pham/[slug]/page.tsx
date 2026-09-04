import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
} from '@/lib/products';
import { CATEGORY_LABELS } from '@/types/product';
import { formatVnd, saleLine, saleNoteLine } from '@/lib/format';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { productJsonLd, breadcrumbJsonLd, absoluteUrl } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ContactButtons } from '@/components/ContactButtons';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductCarousel } from '@/components/ProductCarousel';
import { FavoriteButton } from '@/components/FavoriteButton';

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

  const related = await getRelatedProducts(product, 8);
  const categoryLabel = CATEGORY_LABELS[product.category];
  const productUrl = `${SITE_URL}/san-pham/${product.slug}`;

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: categoryLabel, url: `${SITE_URL}/?loai=${product.category}#san-pham` },
    { name: product.name, url: productUrl },
  ]);

  return (
    <article className="container-content py-10">
      <JsonLd data={productJsonLd(product, productUrl)} id="ld-product" />
      <JsonLd data={breadcrumb} id="ld-breadcrumb-product" />

      {/* Breadcrumb hiển thị */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
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

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Ảnh — gallery */}
        <div className="flex justify-center lg:justify-start">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Thông tin */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                {categoryLabel}
              </p>
              <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">
                {product.name}
              </h1>
            </div>
            <FavoriteButton slug={product.slug} size="md" className="mt-1 shrink-0" />
          </div>

          {/* Thông số */}
          <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
            {product.brand && (
              <SpecRow label="Thương hiệu" value={product.brand} />
            )}
            {product.sizes.length > 0 && (
              <SpecRow label="Size" value={product.sizes.join(' / ')} />
            )}
            {/*
              Ghi rõ "3 ngày" thay vì "Phí thuê" trơn: ngay dưới nó là mức 1
              ngày, để nhãn cũ thì hai dòng đọc như hai giá cho cùng một thứ.
            */}
            <SpecRow
              label="Phí thuê 3 ngày"
              value={formatVnd(product.rentPrice)}
              valueClassName="font-serif text-xl text-accent-dark"
            />
            {/*
              Mức 1 ngày CHỈ hiện ở trang này, không đưa lên thẻ trong lưới:
              lưới đã có 3 dòng giá, thêm dòng thứ tư là khách phải đọc nhiều
              hơn nhìn mẫu. `null` = shop chưa nhập -> ẩn hẳn dòng, không hiện
              "0đ" hay "Liên hệ" (api-cong-khai.md §2).
            */}
            {product.rentPrice1Day != null && (
              <SpecRow
                label="Phí thuê 1 ngày"
                value={formatVnd(product.rentPrice1Day)}
                valueClassName="font-serif text-xl text-ink"
              />
            )}
            <SpecRow
              label="Phí cọc"
              value={formatVnd(product.depositPrice)}
              valueClassName="font-serif text-xl text-ink"
            />
            {/*
              Giá tag = giá gốc trên nhãn, KHÔNG phải khoản khách trả. Vẫn để
              CÙNG font và CÙNG cỡ với ba dòng giá trên: bốn con số nằm cùng
              một bảng, chỉ một dòng lệch cỡ là trông như lỗi hiển thị.
            */}
            {product.tagPrice != null && (
              <SpecRow
                label="Giá tag"
                value={formatVnd(product.tagPrice)}
                valueClassName="font-serif text-xl text-ink"
              />
            )}
          </dl>

          <p className="mt-3 text-xs text-muted">
            * Phí cọc được hoàn lại khi bạn trả đồ đúng hẹn và&nbsp;nguyên&nbsp;vẹn.
          </p>

          {/* Mẫu đang pass: VẪN cho thuê như thường, chỉ báo thêm là bán được. */}
          {product.sale && (
            <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">
                Mẫu này đang pass
              </p>
              {/* Cùng câu chữ, cùng cỡ chữ với thẻ ở trang /thanh-ly. */}
              <p className="mt-1.5 text-sm font-medium text-accent-dark">
                {saleLine(product.sale.price, product.rentPrice)}
              </p>
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

          <ContactButtons
            className="mt-6"
            zaloLabel="Nhắn Zalo giữ mẫu này"
            contextLabel={`${product.name} (mã ${product.id})`}
          />

          {/* Trước đây chỗ này là ô "kiểm tra lịch trống".
              Đã bỏ theo yêu cầu chủ shop (11/08/2026): website không hiện lịch
              bận của từng món. Khách hỏi thì nhắn Zalo, nhân viên tra trong app
              rồi trả lời — nút Zalo nằm ngay phía trên. */}
          <p className="mt-8 rounded-lg border border-hairline bg-tint px-4 py-3 text-sm text-muted">
            Muốn biết mẫu này còn trống ngày bạn cần? Nhắn Zalo cho tiệm, bọn mình
            kiểm tra và báo lại ngay.
          </p>
        </div>
      </div>

      {/* Mẫu tương tự */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-accent-dark">Mẫu tương tự</h2>
          <div className="mt-6">
            <ProductCarousel products={related} />
          </div>
        </section>
      )}
    </article>
  );
}

function SpecRow({
  label,
  value,
  valueClassName = 'text-sm font-medium text-ink',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={valueClassName}>{value}</dd>
    </div>
  );
}
