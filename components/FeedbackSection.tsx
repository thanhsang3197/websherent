import Link from 'next/link';
import type { Feedback } from '@/types/feedback';
import { siteConfig } from '@/lib/site-config';
import { FeedbackGallery } from '@/components/FeedbackGallery';

/** Dải trang chủ hiện tối đa ngần này thẻ — khớp cảnh báo bên app (màn Feedback). */
const SO_O_TRANG_CHU = 8;

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
 */
export function FeedbackSection({ feedback }: { feedback: Feedback[] }) {
  const items = chonFeedbackTrangChu(feedback);
  if (items.length === 0) return null;

  return (
    <section className="container-content pb-16" aria-labelledby="feedback-tieu-de">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">
            Feedback
          </p>
          <h2 id="feedback-tieu-de" className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            Khách hàng của {siteConfig.name}
          </h2>
        </div>
        <Link
          href="/feedback"
          className="shrink-0 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="mt-6">
        <FeedbackGallery feedback={items} kieu="dai" />
      </div>
    </section>
  );
}
