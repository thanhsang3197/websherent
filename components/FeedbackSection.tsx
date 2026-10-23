import Image from 'next/image';
import Link from 'next/link';
import type { Feedback } from '@/types/feedback';
import { siteConfig } from '@/lib/site-config';

/** Dải trang chủ hiện tối đa ngần này thẻ — khớp cảnh báo bên app (màn Feedback). */
const SO_O_TRANG_CHU = 8;

/** Khung gọn trên trang chủ chỉ hiện ngần này ảnh, phần còn lại ở /feedback. */
const SO_ANH_KHUNG = 3;

/**
 * Chọn feedback cho dải trang chủ: những cái shop GHIM "Nổi bật" theo đúng thứ
 * tự shop kéo bên app; chưa ghim cái nào thì lấy mới nhất. Số thứ tự có lỗ
 * trống nên chỉ dùng để sắp, `id` là khoá phân định cuối.
 */
export function chonFeedbackTrangChu(ds: Feedback[]): Feedback[] {
  const ghim = ds
    .filter((f) => f.noiBatThuTu !== null)
    .sort((a, b) => (a.noiBatThuTu ?? 0) - (b.noiBatThuTu ?? 0) || a.id.localeCompare(b.id));
  return (ghim.length > 0 ? ghim : ds).slice(0, SO_O_TRANG_CHU);
}

/**
 * Khối "Khách hàng của Sherent" trên trang chủ. Rỗng thì ẩn CẢ KHỐI, kể cả
 * tiêu đề — gồm cả lúc bản app đang chạy chưa có tính năng feedback.
 *
 * 23/10/2026: đổi từ dải cuộn ngang (chiếm gần cả màn hình điện thoại) sang
 * một khung gọn cùng kiểu mục Thanh lý — vài ảnh + lời khách + nút sang
 * /feedback, để không lấn phần sản phẩm. Ảnh nằm bên trái cho khác khối
 * Thanh lý ngay bên dưới.
 */
export function FeedbackSection({ feedback }: { feedback: Feedback[] }) {
  const items = chonFeedbackTrangChu(feedback);
  if (items.length === 0) return null;

  const anh = items.slice(0, SO_ANH_KHUNG);
  const loi = items.find((f) => f.loiKhach)?.loiKhach ?? null;

  return (
    <section className="container-content pb-8" aria-labelledby="feedback-tieu-de">
      <Link
        href="/feedback"
        className="group grid items-center gap-6 overflow-hidden rounded-2xl border border-hairline bg-surface/70 p-5 shadow-glass transition-shadow hover:shadow-glass-hover sm:p-8 md:grid-cols-[auto_1fr] md:gap-10"
      >
        <div className="flex gap-2.5 sm:gap-3">
          {anh.map((f) => (
            <div
              key={f.id}
              className="relative aspect-[4/5] w-[30%] overflow-hidden rounded-xl bg-tint md:w-24 min-[900px]:w-32 xl:w-36"
            >
              <Image
                src={f.anh[0]}
                alt={`${f.tenHienThi ?? `Khách hàng của ${siteConfig.name}`} mặc đồ của ${siteConfig.name}`}
                fill
                sizes="(max-width: 640px) 30vw, 9rem"
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
            Khách hàng · {feedback.length} khoảnh khắc
          </p>
          <h2 id="feedback-tieu-de" className="mt-3 whitespace-nowrap font-serif text-2xl text-ink sm:text-3xl md:text-[1.75rem] min-[900px]:text-3xl xl:text-4xl">
            Họ đã diện &quot;{siteConfig.name.toUpperCase()}&quot;
          </h2>
          {loi && (
            <p className="mt-3 line-clamp-2 max-w-md font-serif text-lg italic leading-snug text-ink/80">
              “{loi}”
            </p>
          )}
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/80">
            Những bức ảnh thật từ khách hàng đã tin chọn {siteConfig.name} cho ngày quan trọng của mình.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-dark px-5 py-2.5 text-sm font-medium text-accent-dark transition-colors group-hover:bg-accent-dark group-hover:text-white">
            Xem lookbook khách hàng
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </section>
  );
}
