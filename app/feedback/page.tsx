import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { Feedback } from '@/types/feedback';
import { getFeedback } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import { FeedbackGallery } from '@/components/FeedbackGallery';
import { ContactButtons } from '@/components/ContactButtons';
import { TEN_AN_DANH, dongPhu } from '@/components/FeedbackCard';

// ISR giống các trang khác. App gọi /api/lam-moi mỗi khi shop sửa feedback ->
// trang dựng lại ngay. Xem app/san-pham/[slug]/page.tsx để biết vì sao 7 ngày.
export const revalidate = 604800;

const TITLE = `Feedback — Khách hàng của ${siteConfig.name}`;
const DESCRIPTION =
  `Ảnh thật của khách đã thuê đầm, váy, áo dài tại ${siteConfig.name} — ` +
  `đám cưới, kỷ yếu, chụp ảnh, dự tiệc. Xem khách mặc ngoài đời trước khi chọn mẫu.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/feedback' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/feedback`,
    images: [{ url: siteConfig.ogImage }],
  },
};

export default async function FeedbackPage() {
  const feedback = await getFeedback();
  const nangTho = feedback.find((f) => f.nangTho) ?? null;

  return (
    <div className="container-content py-12 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
          Feedback
        </p>
        <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">
          Khách hàng của {siteConfig.name}
        </h1>
        <p className="mt-3 text-ink">
          Những khoảnh khắc khách đã diện đồ của tiệm — ảnh thật, do chính khách gửi.
          Cảm ơn mọi người đã tin chọn {siteConfig.name} 💕
        </p>
      </header>

      {/* Lời mời gửi ảnh — để khách sau mạnh dạn gửi feedback. */}
      <section className="mx-auto mt-6 max-w-xl rounded-2xl border border-hairline bg-tint/70 px-4 py-4 text-center shadow-glass sm:px-8 sm:py-5">
        <p className="font-serif text-base text-accent-dark sm:text-xl">
          Ảnh của bạn có thể xuất hiện ở đây 💕
        </p>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          Gửi ảnh FB để nhận voucher giảm 5% cho đơn thuê tiếp theo nhé
        </p>
        <div className="mt-3 flex justify-center">
          <ContactButtons viTri="feedback" zaloLabel="Gửi ảnh qua Zalo" compact />
        </div>
      </section>

      {nangTho && <NangTho fb={nangTho} />}

      {feedback.length === 0 ? (
        // Trang có link riêng (menu, sitemap) nên không ẩn được như khối trang
        // chủ — rỗng thì mời khách là người đầu tiên.
        <div className="mt-10 rounded-lg border border-hairline bg-tint px-5 py-8 text-center">
          <p className="font-serif text-lg text-accent-dark">Feedback đang được cập nhật</p>
          <Link href="/#san-pham" className="btn btn-outline mt-5">
            Xem tất cả mẫu
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <FeedbackGallery feedback={feedback} locTheoDip />
        </div>
      )}
    </div>
  );
}

/** "Nàng thơ của tháng" — một feedback shop chọn, hiện to ở đầu trang. */
function NangTho({ fb }: { fb: Feedback }) {
  const ten = fb.tenHienThi ?? TEN_AN_DANH;
  const phu = dongPhu(fb);
  return (
    <section
      aria-label="Nàng thơ của tháng"
      className="mt-8 grid overflow-hidden rounded-3xl bg-surface shadow-glass ring-1 ring-hairline sm:grid-cols-2"
    >
      <div className="relative aspect-[4/5] bg-tint sm:aspect-auto sm:min-h-[26rem]">
        <Image
          src={fb.anh[0]}
          alt={`${ten} — nàng thơ của tháng tại ${siteConfig.name}`}
          fill
          priority
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        <span className="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
          ✦ Nàng thơ của tháng
        </span>
        {fb.loiKhach && (
          <blockquote className="font-serif text-2xl italic leading-relaxed text-ink sm:text-3xl">
            “{fb.loiKhach}”
          </blockquote>
        )}
        <div>
          <p className="font-semibold text-accent-dark">{ten}</p>
          {phu && <p className="mt-0.5 text-sm text-muted">{phu}</p>}
          {fb.instagram && (
            <a
              href={`https://www.instagram.com/${fb.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-accent-dark underline-offset-4 hover:underline"
            >
              @{fb.instagram}
            </a>
          )}
        </div>
        {fb.mau && (
          <Link
            href={`/san-pham/${fb.mau.slug}`}
            className="text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
          >
            Mẫu nàng đã mặc: {fb.mau.ten} →
          </Link>
        )}
      </div>
    </section>
  );
}
