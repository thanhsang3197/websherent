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
 * Ảnh luôn phủ kín khung và cắt GIỮA: `kieu="dai"` khung 4:5 cho dải trang
 * chủ (các thẻ phải cao bằng nhau), `kieu="cat"` khung theo `tiLe` cho lưới so
 * le. Hộp xem ảnh lớn mới hiện nguyên story.
 */
export function FeedbackCard({
  fb,
  onMo,
  kieu = 'cat',
  tiLe = 'aspect-[4/5]',
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: {
  fb: Feedback;
  onMo: () => void;
  /**
   * - `dai`   : khung 4:5 cố định (dải trang chủ).
   * - `cat`   : khung theo `tiLe`, ảnh cắt GIỮA cho vừa — lưới so le.
   */
  kieu?: 'dai' | 'cat';
  /** Lớp Tailwind `aspect-[…]` cho `kieu="cat"` — viết nguyên văn để JIT thấy. */
  tiLe?: string;
  sizes?: string;
}) {
  const ten = fb.tenHienThi ?? TEN_AN_DANH;
  const phu = dongPhu(fb);
  const alt = `${ten} mặc đồ của ${siteConfig.name}`;

  const anhPhu = fb.anh.length > 1 && (
    <span className="absolute right-2 top-2 rounded-full bg-ink/55 px-2 py-0.5 text-[11px] font-medium text-surface backdrop-blur-sm">
      +{fb.anh.length - 1} ảnh
    </span>
  );

  const vo =
    'group block w-full overflow-hidden rounded-2xl bg-surface text-left shadow-glass ring-1 ring-hairline transition-all duration-300 hover:shadow-glass-hover hover:ring-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent';

  const khung = kieu === 'dai' ? 'aspect-[4/5]' : tiLe;

  return (
    <button type="button" onClick={onMo} className={vo} aria-label={`Xem feedback của ${ten}`}>
      <span className={`relative block overflow-hidden bg-tint ${khung}`}>
        <Image
          src={fb.anh[0]}
          alt={alt}
          fill
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes={sizes}
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
        {anhPhu}
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
