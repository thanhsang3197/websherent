import Link from 'next/link';
import type { Album } from '@/types/album';
import { AlbumStrip } from '@/components/AlbumStrip';

/** Khối trang chủ hiện tối đa bấy nhiêu album; nhiều hơn thì có link "Xem tất cả". */
const SO_ALBUM_TRANG_CHU = 8;

/**
 * Khối "Album" trên trang chủ (api-cong-khai.md §2.4).
 *
 * Rỗng thì ẩn CẢ KHỐI kể cả tiêu đề — gồm cả lúc bản app đang chạy chưa có
 * tính năng album (getAlbums trả []).
 *
 * Mọi màn hình: một hàng kéo ngang (AlbumStrip), lộ một phần thẻ cuối để khách
 * biết còn nữa mà không đẩy bộ sưu tập bên dưới xuống xa.
 */
export function AlbumSection({ albums }: { albums: Album[] }) {
  if (albums.length === 0) return null;

  const items = albums.slice(0, SO_ALBUM_TRANG_CHU);
  const conNua = albums.length > items.length;

  return (
    <section className="container-content py-5 sm:py-10" aria-labelledby="album-tieu-de">
      <div className="flex items-end justify-between gap-4">
        <h2 id="album-tieu-de" className="font-serif text-2xl text-ink sm:text-3xl">
          Album tuyển chọn
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

      <AlbumStrip albums={items} />
    </section>
  );
}
