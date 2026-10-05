import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getUuDai } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import { demNguoc, khoangNgay } from '@/lib/uu-dai';
import { ContactButtons } from '@/components/ContactButtons';

// ISR 1 giờ: chương trình hết hạn / tới ngày bắt đầu tự đổi mà không cần ai
// bấm gì (lib/internal-api.ts, UU_DAI_REVALIDATE_SECONDS). Shop sửa ưu đãi
// trong app thì /api/lam-moi làm trang dựng lại ngay.
export const revalidate = 3600;

// Layout tự thêm "· Sherent" vào cuối (title.template) nên không ghi tên tiệm ở đây.
const TITLE = 'Ưu đãi & thể lệ';
const DESCRIPTION =
  `Chương trình ưu đãi đang diễn ra tại ${siteConfig.name}: gửi ảnh nhận quà, ` +
  `voucher, sự kiện. Xem thể lệ và cách tham gia.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/uu-dai' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/uu-dai`,
    images: [{ url: siteConfig.ogImage }],
  },
};

export default async function UuDaiPage() {
  const uuDai = await getUuDai();

  return (
    <div className="container-content py-12 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">Ưu đãi</p>
        <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">
          Ưu đãi & thể lệ tại {siteConfig.name}
        </h1>
        <p className="mt-3 text-ink">
          Các chương trình tiệm đang chạy, kèm cách tham gia. Cần hỏi thêm cứ nhắn tiệm
          qua Zalo hoặc Facebook ở cuối trang nhé 💕
        </p>
      </header>

      {uuDai.length === 0 ? (
        // Trang có link riêng (thanh trên cùng, khối trang chủ, sitemap) nên
        // không ẩn được — rỗng thì nói thẳng và đưa khách về bộ sưu tập.
        <div className="mt-10 rounded-lg border border-hairline bg-tint px-5 py-8 text-center">
          <p className="font-serif text-lg text-accent-dark">
            Hiện tiệm chưa có chương trình ưu đãi nào
          </p>
          <p className="mt-2 text-sm text-muted">
            Chương trình mới sẽ được cập nhật tại đây. Theo dõi tiệm qua Zalo hoặc Facebook để
            không bỏ lỡ nhé.
          </p>
          <Link href="/#san-pham" className="btn btn-outline mt-5">
            Xem bộ sưu tập
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {uuDai.map((u, i) => {
            const han = demNguoc(u.ketThuc);
            const ngay = khoangNgay(u.batDau, u.ketThuc);
            return (
              // `id` = mã ưu đãi: thanh trên cùng và thẻ trang chủ dẫn thẳng tới
              // đúng chương trình khách vừa bấm. scroll-mt chừa chỗ cho Header dính.
              <article
                key={u.id}
                id={u.id}
                className="scroll-mt-24 overflow-hidden rounded-3xl border border-hairline bg-surface shadow-glass"
              >
                {u.anh && (
                  <div className="relative aspect-[16/10] bg-tint sm:aspect-[16/7]">
                    <Image
                      src={u.anh}
                      alt={u.tieuDe}
                      fill
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL={GLASS_BLUR_DATA_URL}
                      sizes="(max-width: 1152px) 100vw, 1152px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
                      {u.loaiTen}
                    </span>
                    {han && <span className="text-sm font-semibold text-accent-dark">{han}</span>}
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">{u.tieuDe}</h2>
                  {ngay && <p className="mt-1 text-sm text-muted">{ngay}</p>}
                  {u.moTaNgan && <p className="mt-3 leading-relaxed text-ink">{u.moTaNgan}</p>}

                  {u.theLe && (
                    <div className="mt-5 rounded-2xl bg-tint/70 p-4 sm:p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-dark">
                        Thể lệ
                      </h3>
                      {/* Xuống dòng shop gõ trong app được giữ nguyên. */}
                      <p className="mt-2 whitespace-pre-line leading-relaxed text-ink">{u.theLe}</p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section
        aria-labelledby="uu-dai-lien-he"
        className="mx-auto mt-14 max-w-xl rounded-3xl border border-hairline bg-tint/70 px-6 py-8 text-center shadow-glass sm:px-10"
      >
        <h2 id="uu-dai-lien-he" className="font-serif text-2xl text-accent-dark">
          Tham gia hoặc hỏi thêm
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          Nhắn tiệm để được hướng dẫn tham gia, gửi ảnh hoặc nhận ưu đãi. Tiệm trả lời trong khung
          giờ {siteConfig.openingHours.text}.
        </p>
        <div className="mt-5 flex justify-center">
          <ContactButtons viTri="uu-dai" zaloLabel="Nhắn Zalo tham gia" />
        </div>
        <ul className="mt-5 space-y-1.5 text-sm text-ink">
          <li>
            Zalo / điện thoại:{' '}
            <a
              href={siteConfig.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-dark underline-offset-4 hover:underline"
            >
              {siteConfig.phone.display}
            </a>
          </li>
          <li>
            Facebook:{' '}
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-dark underline-offset-4 hover:underline"
            >
              Trang {siteConfig.name}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
