import Image from 'next/image';
import type { Feedback } from '@/types/feedback';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

/** Tên hiện cho khách ẩn danh. */
export const TEN_AN_DANH = `Khách hàng của ${siteConfig.name}`;

/** "Đám cưới · Tháng 9/2026" — bỏ phần nào thiếu. */
export function dongPhu(fb: Feedback): string {
  return [fb.dipTen, fb.thang].filter(Boolean).join(' · ');
}

/**
 * Thẻ một feedback: ảnh bìa + lời khách + tên.
 *
 * Là một NÚT (mở hộp xem ảnh lớn), không phải link — nơi dùng truyền `onMo`.
 *
 * `kieu="luoi"` để ảnh giữ ĐÚNG tỉ lệ gốc ở lưới trang Feedback;
 * `kieu="dai"` ép khung 4:5 cho dải trượt ngang ở trang chủ, nơi các thẻ phải
 * cao bằng nhau.
 */
export function FeedbackCard({
  fb,
  onMo,
  kieu = 'luoi',
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: {
  fb: Feedback;
  onMo: () => void;
  kieu?: 'luoi' | 'dai';
  sizes?: string;
}) {
  const ten = fb.tenHienThi ?? TEN_AN_DANH;
  const phu = dongPhu(fb);

  return (
    <button
      type="button"
      onClick={onMo}
      className="group block w-full overflow-hidden rounded-2xl bg-surface text-left shadow-glass ring-1 ring-hairline transition-all duration-300 hover:shadow-glass-hover hover:ring-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`Xem feedback của ${ten}`}
    >
      <span
        className={`relative block overflow-hidden bg-tint ${kieu === 'dai' ? 'aspect-[4/5]' : ''}`}
      >
        {kieu === 'dai' ? (
          <Image
            src={fb.anh[0]}
            alt={`${ten} mặc đồ của ${siteConfig.name}`}
            fill
            placeholder="blur"
            blurDataURL={GLASS_BLUR_DATA_URL}
            sizes={sizes}
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        ) : (
          // width/height chỉ là tỉ lệ tạm lúc chưa tải; `h-auto` để ảnh về
          // đúng tỉ lệ thật.
          <Image
            src={fb.anh[0]}
            alt={`${ten} mặc đồ của ${siteConfig.name}`}
            width={600}
            height={800}
            placeholder="blur"
            blurDataURL={GLASS_BLUR_DATA_URL}
            sizes={sizes}
            className="h-auto w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        )}
        {fb.anh.length > 1 && (
          <span className="absolute right-2 top-2 rounded-full bg-ink/55 px-2 py-0.5 text-[11px] font-medium text-surface backdrop-blur-sm">
            +{fb.anh.length - 1} ảnh
          </span>
        )}
      </span>

      <span className="block space-y-1.5 p-3 sm:p-4">
        {fb.loiKhach && (
          <span className="line-clamp-3 block font-serif text-[15px] italic leading-snug text-ink">
            “{fb.loiKhach}”
          </span>
        )}
        <span className="block truncate text-sm font-semibold text-accent-dark">{ten}</span>
        {phu && <span className="block text-xs text-muted">{phu}</span>}
      </span>
    </button>
  );
}
