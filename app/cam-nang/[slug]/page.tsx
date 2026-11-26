import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BAI_VIET, getBaiViet } from '@/lib/cam-nang';
import { getThongKeGia } from '@/lib/thong-ke-gia';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { ContactButtons } from '@/components/ContactButtons';

// Giá trong bài tính từ catalogue — làm mới theo nhịp catalogue (app gọi
// /api/lam-moi thì cache bay theo tag), 1 ngày là lưới an toàn.
export const revalidate = 86400;

export function generateStaticParams() {
  return BAI_VIET.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const bai = getBaiViet(params.slug);
  if (!bai) return { title: 'Không tìm thấy bài viết' };
  return {
    title: bai.tieuDe,
    description: bai.moTa,
    alternates: { canonical: `/cam-nang/${bai.slug}` },
    openGraph: {
      type: 'article',
      title: bai.tieuDe,
      description: bai.moTa,
      url: `${SITE_URL}/cam-nang/${bai.slug}`,
      publishedTime: bai.ngayDang,
    },
  };
}

function ngayVN(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Kiểu chữ cho thân bài — viết thẳng bằng selector con thay vì cài plugin
 * typography cho mỗi một trang.
 */
const THAN_BAI = [
  'text-[17px] leading-[1.8] text-ink',
  '[&_p]:mt-5',
  '[&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-[1.6rem] [&_h2]:leading-snug [&_h2]:text-ink',
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-6',
  '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-6',
  '[&_li]:pl-1 [&_li::marker]:text-accent',
  '[&_strong]:font-semibold',
  '[&_a]:font-medium [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-accent-dark',
].join(' ');

export default async function BaiVietPage({ params }: { params: { slug: string } }) {
  const bai = getBaiViet(params.slug);
  if (!bai) notFound();

  const tk = await getThongKeGia();
  const goiY = tk[bai.loai]?.mauNoiBat.slice(0, 4) ?? [];
  const url = `${SITE_URL}/cam-nang/${bai.slug}`;
  const baiKhac = BAI_VIET.filter((b) => b.slug !== bai.slug);

  return (
    <>
      <JsonLd
        id="ld-article"
        data={{
          ...articleJsonLd({
            title: bai.tieuDe,
            excerpt: bai.moTa,
            publishedAt: bai.ngayDang,
            url,
            coverImage: goiY[0]?.image ?? undefined,
          }),
          dateModified: bai.ngaySua ?? bai.ngayDang,
        }}
      />
      <JsonLd
        id="ld-breadcrumb-cam-nang"
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', url: `${SITE_URL}/` },
          { name: 'Cẩm nang', url: `${SITE_URL}/cam-nang` },
          { name: bai.tieuDe, url },
        ])}
      />

      <article className="container-content pb-16 pt-8 sm:pt-14">
        <div className="mx-auto max-w-[68ch]">
          <nav aria-label="Đường dẫn" className="text-sm text-muted">
            <Link href="/" className="hover:text-accent-dark">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link href="/cam-nang" className="hover:text-accent-dark">
              Cẩm nang
            </Link>
          </nav>

          <h1 className="mt-5 font-serif text-[clamp(1.9rem,6vw,2.9rem)] leading-[1.2] tracking-[-0.01em] text-ink">
            {bai.tieuDe}
          </h1>
          <p className="mt-4 text-sm text-muted">
            {siteConfig.name} · {ngayVN(bai.ngaySua ?? bai.ngayDang)}
          </p>

          <div className={`mt-6 ${THAN_BAI}`}>{bai.noiDung(tk)}</div>
        </div>

        {goiY.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl">
            <h2 className="font-serif text-2xl text-ink">Mẫu đang cho thuê</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
              {goiY.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <p className="mt-6 text-center">
              <Link
                href="/#san-pham"
                className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-accent-dark"
              >
                Xem tất cả mẫu
              </Link>
            </p>
          </section>
        )}

        <section className="mx-auto mt-14 max-w-[68ch] rounded-3xl bg-surface px-6 py-8 text-center">
          <h2 className="font-serif text-2xl text-ink">Cần tư vấn mẫu hay size?</h2>
          <p className="mt-2 text-ink">
            Nhắn {siteConfig.name} kèm ngày bạn cần mặc để được tư vấn và giữ mẫu.
          </p>
          <ContactButtons className="mx-auto mt-5" viTri="cam-nang" />
        </section>

        {baiKhac.length > 0 && (
          <section className="mx-auto mt-14 max-w-[68ch]">
            <h2 className="font-serif text-xl text-ink">Bài khác</h2>
            <ul className="mt-4 space-y-3">
              {baiKhac.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/cam-nang/${b.slug}`}
                    className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-accent-dark"
                  >
                    {b.tieuDe}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
