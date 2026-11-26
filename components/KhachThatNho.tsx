import Image from 'next/image';
import Link from 'next/link';

/**
 * Dải nhỏ "khách thật" đặt ngay dưới nút giữ mẫu ở trang sản phẩm (thử
 * 27/11/2026): 3 ảnh tròn chồng nhau + một dòng chữ, bấm vào là xem ảnh.
 *
 *   - kieu="mau":   khách đã mặc ĐÚNG mẫu này -> nhảy xuống #khach-da-mac.
 *   - kieu="chung": mẫu chưa có ảnh khách riêng -> dẫn sang /feedback, chữ ghi
 *                   rõ là khách của tiệm, KHÔNG nói là khách của mẫu này.
 *
 * Con số là số feedback thật từ app nội bộ, không làm tròn, không cộng thêm. Dải
 * chung ghi "feedback" chứ không ghi "khách" vì một khách có thể gửi nhiều lần.
 */
export function KhachThatNho({
  anh,
  soKhach,
  href,
  kieu,
}: {
  anh: string[];
  soKhach: number;
  href: string;
  kieu: 'mau' | 'chung';
}) {
  const ba = anh.filter(Boolean).slice(0, 3);
  if (ba.length === 0 || soKhach <= 0) return null;

  return (
    <Link
      href={href}
      className="group mt-3 flex max-w-md items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm ring-1 ring-inset ring-hairline transition-colors hover:ring-accent/50"
    >
      <span className="flex shrink-0 -space-x-3" aria-hidden="true">
        {ba.map((src, i) => (
          <span
            key={`${src}-${i}`}
            className="relative block h-10 w-10 overflow-hidden rounded-full bg-tint ring-2 ring-surface"
          >
            <Image src={src} alt="" fill sizes="40px" className="object-cover" />
          </span>
        ))}
      </span>
      <span className="min-w-0 flex-1 leading-snug">
        <b className="block text-ink">
          {kieu === 'mau'
            ? `${soKhach} khách đã mặc mẫu này`
            : `${soKhach} feedback ảnh thật từ khách của tiệm`}
        </b>
        <span className="text-muted">
          {kieu === 'mau' ? 'Xem ảnh khách thật ↓' : 'Xem ảnh khách thật →'}
        </span>
      </span>
    </Link>
  );
}
