import Link from 'next/link';
import type { Album } from '@/types/album';
import { AlbumCard } from '@/components/AlbumCard';

/** Khối trang chủ hiện tối đa bấy nhiêu album; nhiều hơn thì có link "Xem tất cả". */
const SO_ALBUM_TRANG_CHU = 8;

/**
 * Khối "Album" trên trang chủ (api-cong-khai.md §2.4).
 *
 * Rỗng thì ẩn CẢ KHỐI kể cả tiêu đề — gồm cả lúc bản app đang chạy chưa có
 * tính năng album (getAlbums trả []).
 *
 * Điện thoại: một hàng vuốt ngang, lộ nửa thẻ cuối để khách biết còn nữa mà
 * không đẩy bộ sưu tập bên dưới xuống xa. Máy tính: lưới 4 cột.
 */
export function AlbumSection({ albums }: { albums: Album[] }) {
  if (albums.length === 0) return null;

  const items = albums.slice(0, SO_ALBUM_TRANG_CHU);
  const conNua = albums.length > items.length;

  return (
    <section className="container-content py-10" aria-labelledby="album-tieu-de">
      <div className="flex items-end justify-between gap-4">
        <h2 id="album-tieu-de" className="font-serif text-2xl text-accent-dark sm:text-3xl">
          Album
        </h2>
        {conNua && (
          <Link
            href="/album"
            className="shrink-0 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
          >
            Xem tất cả →
          </Link>
        )}
      </div>

      <ul className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {items.map((album) => (
          <li key={album.slug} className="w-[42vw] shrink-0 snap-start sm:w-auto">
            <AlbumCard album={album} sizes="(max-width: 640px) 42vw, (max-width: 1024px) 33vw, 25vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
