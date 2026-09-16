import type { Metadata } from 'next';
import Link from 'next/link';
import { getAlbums } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { AlbumCard } from '@/components/AlbumCard';

// ISR giống các trang khác. App gọi /api/lam-moi mỗi khi shop gắn nhãn, đổi
// điều kiện, ghim hay bật/tắt album -> trang dựng lại ngay (api-cong-khai.md
// §2.4). Xem app/san-pham/[slug]/page.tsx để biết vì sao 7 ngày.
export const revalidate = 604800;

const TITLE = 'Album — đầm, váy & áo dài theo dịp';
const DESCRIPTION =
  `Các album mẫu ${siteConfig.name} chọn sẵn theo dịp và kiểu dáng — ` +
  `váy dự lễ tốt nghiệp, váy tiệc, váy ngắn… Bấm vào album để xem mẫu và nhắn Zalo giữ mẫu.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/album' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/album`,
    images: [{ url: siteConfig.ogImage }],
  },
};

export default async function AlbumListPage() {
  const albums = await getAlbums();

  return (
    <div className="container-content py-12 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
          Bộ sưu tập
        </p>
        <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">Album</h1>
        <p className="mt-3 text-ink">
          Mẫu tiệm chọn sẵn theo dịp và kiểu dáng — bấm vào album để xem.
        </p>
      </header>

      {albums.length === 0 ? (
        // Trang này có link riêng (sitemap, khách lưu lại) nên không ẩn được
        // như khối trang chủ — rỗng thì dẫn khách về bộ sưu tập chung.
        <div className="mt-10 rounded-lg border border-hairline bg-tint px-5 py-8 text-center">
          <p className="font-serif text-lg text-accent-dark">Hiện chưa có album nào</p>
          <Link href="/#san-pham" className="btn btn-outline mt-5">
            Xem tất cả mẫu
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {albums.map((album) => (
            <li key={album.slug}>
              <AlbumCard album={album} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
