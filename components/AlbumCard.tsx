import Image from 'next/image';
import Link from 'next/link';
import type { Album } from '@/types/album';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

/**
 * Thẻ một album: ảnh bìa + tên đè lên ảnh.
 *
 * KHUNG CHỮ NHẬT bo góc, cố ý KHÁC khung vòm của thẻ sản phẩm: album là "một
 * nhóm mẫu" chứ không phải một chiếc đầm — nhìn vào khung là khách phân biệt
 * được bấm vào sẽ ra một danh sách, không phải trang một mẫu.
 *
 * Không in số mẫu: `so_mau` của API đếm theo mã chưa gộp size, in ra thì lệch
 * với số thẻ khách thấy trong album (api-cong-khai.md §2.4).
 */
export function AlbumCard({
  album,
  sizes = '(max-width: 640px) 50vw, 25vw',
}: {
  album: Album;
  /** Thuộc tính `sizes` của ảnh — nơi dùng thẻ biết thẻ rộng bao nhiêu. */
  sizes?: string;
}) {
  return (
    <Link
      href={`/album/${album.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-tint shadow-md ring-1 ring-white/70 transition-all duration-300 hover:shadow-glass-hover hover:ring-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {album.anhBia ? (
        <Image
          src={album.anhBia}
          alt=""
          fill
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes={sizes}
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-serif text-5xl text-accent/45"
        >
          {siteConfig.name.charAt(0)}
        </span>
      )}

      {/* Lớp tối dần ở đáy để tên luôn đọc được trên mọi ảnh bìa. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent"
      />
      <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <span className="line-clamp-2 font-serif text-lg leading-snug text-surface sm:text-xl">
          {album.ten}
        </span>
        <span className="mt-1 block text-xs font-medium text-surface/80">
          Xem album →
        </span>
      </span>
    </Link>
  );
}
