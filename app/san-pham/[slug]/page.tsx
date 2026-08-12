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
import { RecentlyViewedTracker } from '@/components/RecentlyViewedTracker';

// ISR: build sẵn mọi trang, làm mới định kỳ khi dùng Google Sheets.
export const revalidate = 300;

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
      <RecentlyViewedTracker slug={product.slug} />

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
            <SpecRow
              label="Phí thuê"
              value={formatVnd(product.rentPrice)}
              valueClassName="font-serif text-xl text-accent-dark"
            />
            <SpecRow
              label="Phí cọc"
              value={formatVnd(product.depositPrice)}
              valueClassName="font-serif text-xl text-ink"
            />
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
