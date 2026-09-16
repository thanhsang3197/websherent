import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAlbum, getAlbums } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { breadcrumbJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ProductGrid } from '@/components/ProductGrid';

// Xem app/album/page.tsx.
export const revalidate = 604800;

export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getAlbum(params.slug);
  if (!data) return { title: 'Không tìm thấy album' };

  const { album } = data;
  const description =
    album.moTa ??
    `Album ${album.ten} tại ${siteConfig.name}, ${siteConfig.address.district}. ` +
      'Xem mẫu và nhắn Zalo để giữ mẫu.';
  const images = album.anhBia
    ? [{ url: album.anhBia, alt: album.ten }]
    : [{ url: siteConfig.ogImage }];

  return {
    title: album.ten,
    description,
    alternates: { canonical: `/album/${album.slug}` },
    openGraph: {
      title: album.ten,
      description,
      url: `${SITE_URL}/album/${album.slug}`,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: album.ten,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function AlbumPage({ params }: { params: { slug: string } }) {
  // null = slug sai / album bị xoá, ẩn hoặc rỗng — tình huống BÌNH THƯỜNG khi
  // shop tắt album (§2.4), nên là trang 404 chứ không phải trang lỗi.
  const data = await getAlbum(params.slug);
  if (!data) notFound();

  const { album, products } = data;
  const albumUrl = `${SITE_URL}/album/${album.slug}`;

  return (
    <div className="container-content py-10">
      <JsonLd
        id="ld-breadcrumb-album"
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', url: `${SITE_URL}/` },
          { name: 'Album', url: `${SITE_URL}/album` },
          { name: album.ten, url: albumUrl },
        ])}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/album" className="hover:text-accent">
              Album
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 text-ink">{album.ten}</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
          Album
        </p>
        <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">{album.ten}</h1>
        {album.moTa && <p className="mt-3 text-ink">{album.moTa}</p>}
        {/* Đếm SAU khi gộp size = đúng số thẻ khách thấy (không dùng `so_mau`). */}
        <p className="mt-2 text-sm font-medium text-muted">{products.length} mẫu</p>
      </header>

      {/* Giữ NGUYÊN thứ tự shop sắp — không lọc, không sắp lại (§2.4). */}
      <div className="mt-8">
        <ProductGrid products={products} priorityCount={4} />
      </div>
    </div>
  );
}
