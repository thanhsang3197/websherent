import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSaleProducts } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { formatVndD, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { TrackedContactLink } from '@/components/TrackedContactLink';
import { SaleGrid } from '@/components/SaleGrid';
import { KhamThanhLy } from '@/components/KhamThanhLy';
import { RevealRoot } from '@/components/hang/RevealRoot';
import type { Product } from '@/types/product';

// ISR giống các trang khác. Khi shop sửa giá pass bên app nội bộ, app gọi
// /api/lam-moi -> revalidateTag('san-pham') -> trang này dựng lại ngay, không
// phải chờ hết 7 ngày. Xem app/san-pham/[slug]/page.tsx để biết vì sao 7 ngày.
export const revalidate = 604800;

const TITLE = 'Thanh lý — pass lại đầm, váy & áo dài';
const DESCRIPTION =
  `Các mẫu ${siteConfig.name} đang pass lại (bán đứt) với giá thanh lý. ` +
  `Mẫu vẫn cho thuê song song, ai chốt trước lấy trước. Nhắn Zalo để xem thêm ảnh thật và giữ mẫu.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/thanh-ly' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/thanh-ly`,
    images: [{ url: siteConfig.ogImage }],
  },
};

/**
 * Chương trình tặng mẫu khi mua thanh lý — chủ shop đặt, chưa có bên app nên
 * ghi cứng ở đây. Đổi / tắt chương trình thì sửa (hoặc để rỗng) mảng này.
 */
const QUA_TANG = [
  { don: '300k', tang: '50k' },
  { don: '500k', tang: '100k' },
];

/** Hỏi nhanh cách mua — câu chữ lấy từ phần giới thiệu cũ chủ shop đã viết. */
const HOI_DAP: { hoi: string; dap: string }[] = [
  {
    hoi: 'Mua mẫu thanh lý thế nào?',
    dap:
      `Bấm "Nhắn Zalo mua" ở mẫu bạn thích: tin nhắn có sẵn tên, mã và giá được chép lại, bạn chỉ cần dán vào Zalo ` +
      `${siteConfig.phone3.display}. Tiệm gửi thêm ảnh thật và giữ mẫu cho bạn.`,
  },
  {
    hoi: 'Thanh toán và nhận đồ ra sao?',
    dap: 'Tiệm chỉ nhận chuyển khoản trước, rồi bạn ghé shop nhận đồ hoặc shop ship cho bạn.',
  },
  {
    // Câu chữ do chủ shop viết (13/08/2026) — giữ nguyên, đừng "làm hay hơn".
    hoi: 'Giá đã gồm phí ship chưa?',
    dap: 'Giá trên là giá bán, chưa bao gồm phí ship. Có thể xem trực tiếp và nhận váy tại tiệm.',
  },
  {
    hoi: 'Mẫu đang có người thuê thì sao?',
    dap: 'Mẫu vẫn cho thuê bình thường trong lúc chờ pass, nên ai chốt trước lấy trước.',
  },
  ...(QUA_TANG.length > 0
    ? [
        {
          hoi: 'Quà tặng tính thế nào?',
          dap:
            QUA_TANG.map((q) => `Đơn từ ${q.don} được tặng 1 mẫu giá ${q.tang}`).join(', ') +
            '. Chương trình áp dụng cho tới khi hết sản phẩm.',
        },
      ]
    : []),
];

/** Mẫu có ảnh, rẻ nhất trước (danh sách đã sắp sẵn theo giá). */
function mauCoAnh(products: Product[], soMau: number): Product[] {
  return products.filter((p) => p.image && (p.sale?.price ?? 0) > 0).slice(0, soMau);
}

const nutDen =
  'inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97]';

export default async function ThanhLyPage() {
  const products = await getSaleProducts();
  const coGia = products.filter((p) => (p.sale?.price ?? 0) > 0);
  const giaThapNhat = coGia.length ? Math.min(...coGia.map((p) => p.sale!.price)) : 0;
  const khamPha = mauCoAnh(products, 5);
  const anhCuoi = mauCoAnh([...products].reverse(), 1)[0] ?? khamPha[0];
  const anhKham = mauCoAnh(products, Infinity).map((p) => p.image as string);

  if (products.length === 0) return <ChuaCoMau />;

  return (
    <>
      <RevealRoot />

      {/* Đầu trang: tiêu đề, giá thấp nhất, quà tặng; máy tính có khảm ảnh bên phải. */}
      <section className="container-content grid gap-10 pb-10 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-x-6 lg:pb-16">
        <div className="lg:col-span-6">
          <h1 className="font-serif text-[clamp(2.5rem,11vw,3.25rem)] font-medium leading-[1] tracking-[-0.03em] text-ink lg:text-[clamp(52px,5.6vw,88px)]">
            Thanh lý đầm, áo dài
          </h1>
          <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed text-ink">
            Mẫu tiệm từng cho thuê, nay pass lại với giá bán đứt. Mẫu vẫn cho thuê song song nên ai chốt trước
            lấy trước.
          </p>

          <p className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[17px] text-ink sm:gap-x-8">
            <span>
              <span className="font-serif text-[2rem] leading-none tabular-nums sm:text-[2.5rem]">{products.length}</span> mẫu đang pass
            </span>
            {giaThapNhat > 0 && (
              <span>
                giá từ{' '}
                <span className="font-serif text-[2rem] leading-none tabular-nums text-accent-dark sm:text-[2.5rem]">
                  {formatVndD(giaThapNhat)}
                </span>
              </span>
            )}
          </p>

          {QUA_TANG.length > 0 && (
            <div className="mt-8 bg-accent-dark px-5 py-5 text-surface sm:px-6">
              <h2 className="font-serif text-2xl leading-tight">Mua càng nhiều, tặng thêm mẫu</h2>
              <ul className="mt-3 space-y-1.5 text-[17px]">
                {QUA_TANG.map((q) => (
                  <li key={q.don} className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span>Đơn từ {q.don}</span>
                    <span className="font-semibold">tặng 1 mẫu giá {q.tang}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[15px] text-surface/85">Áp dụng cho tới khi hết sản phẩm.</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <a href="#danh-sach" className={nutDen}>
              Xem {products.length} mẫu
            </a>
            <a
              href="#cach-mua"
              className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-accent-dark"
            >
              Cách mua
            </a>
          </div>
        </div>

        {/* Khảm 5 mẫu bốc ngẫu nhiên mỗi lượt xem, mỗi mẫu một ô màu; ô lớn đổi ảnh chậm. Chỉ máy tính. */}
        {anhKham.length >= 4 && (
          <div aria-hidden="true" className="hidden lg:col-span-6 lg:block">
            <KhamThanhLy anh={anhKham} />
          </div>
        )}
      </section>

      {/* Catalogue. */}
      <section id="danh-sach" aria-labelledby="tl-danh-sach" className="container-content scroll-mt-24 pb-24 pt-6 sm:pb-32">
        <h2 id="tl-danh-sach" className="sr-only">
          Các mẫu đang pass
        </h2>
        <SaleGrid products={products} />
      </section>

      {/* Cách mua — tiêu đề dính bên trái (máy tính), câu hỏi là các ô màu. */}
      <section id="cach-mua" aria-labelledby="tl-cach-mua" className="container-content scroll-mt-28 pb-24 sm:pb-32" data-reveal-nhom>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-4">
            <h2
              id="tl-cach-mua"
              data-reveal
              className="font-serif text-[2.25rem] leading-tight text-ink lg:sticky lg:top-32 lg:text-[clamp(40px,4vw,56px)]"
            >
              Cách mua
            </h2>
          </div>
          <div data-reveal className="space-y-1.5 lg:col-span-8">
            {HOI_DAP.map((h, i) => (
              <details key={h.hoi} name="tl-hoi" open={i === 0} className="tl-o group bg-tint/70">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-medium leading-snug text-ink sm:min-h-[72px] sm:px-6 sm:text-xl [&::-webkit-details-marker]:hidden">
                  <span>{h.hoi}</span>
                  <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                    <span className="absolute left-0 top-1/2 h-[3px] w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-[3px] -translate-x-1/2 bg-current transition-transform duration-300 group-open:rotate-90" />
                  </span>
                </summary>
                <p className="max-w-[52ch] px-5 pb-6 text-base leading-relaxed sm:px-6 sm:text-[17px]">{h.dap}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Lời cuối: chưa thấy mẫu vừa ý thì để lại nhu cầu. */}
      <section aria-labelledby="tl-cuoi" className="overflow-hidden bg-tint" data-reveal-nhom>
        <div className="container-content grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-0">
          <div className="lg:order-2 lg:col-span-4 lg:col-start-9 lg:py-24">
            <h2 id="tl-cuoi" data-reveal className="font-serif text-[1.75rem] leading-tight text-ink lg:text-[2.25rem]">
              Chưa thấy mẫu vừa ý?
            </h2>
            <p data-reveal className="mt-4 text-[17px] leading-relaxed text-ink">
              Nhắn tiệm dáng đầm, size và tầm giá bạn cần. Có mẫu mới pass là tiệm báo bạn ngay.
            </p>
            <div data-reveal className="mt-7">
              <TrackedContactLink href={siteConfig.zaloUrl3} kieu="zalo" viTri="thanh-ly" className={`${nutDen} w-full sm:w-auto`}>
                Nhắn Zalo {siteConfig.phone3.display}
              </TrackedContactLink>
            </div>
          </div>
          {anhCuoi?.image && (
            // overflow-hidden: ảnh phóng 130% để mép cắt, phần tràn không được trùm lên nút bên trên.
            <div data-reveal className="relative -mx-5 h-[55svh] overflow-hidden lg:order-1 lg:col-span-7 lg:mx-0 lg:h-[80svh]">
              <Image
                src={anhCuoi.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                placeholder="blur"
                blurDataURL={GLASS_BLUR_DATA_URL}
                className="scale-[1.3] object-cover object-[30%_20%]"
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/** Chưa có mẫu nào đang pass. */
function ChuaCoMau() {
  return (
    <section className="container-content py-16 sm:py-24">
      <h1 className="font-serif text-[clamp(2.5rem,11vw,3.25rem)] font-medium leading-[1] tracking-[-0.03em] text-ink lg:text-6xl">
        Thanh lý đầm, áo dài
      </h1>
      <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-ink">
        Hiện chưa có mẫu nào đang pass. Bạn cứ nhắn Zalo cho tiệm nhu cầu của mình (dáng đầm, size, tầm giá), có
        mẫu ra là bọn mình báo ngay.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        <TrackedContactLink href={siteConfig.zaloUrl3} kieu="zalo" viTri="thanh-ly" className={nutDen}>
          Nhắn Zalo {siteConfig.phone3.display}
        </TrackedContactLink>
        <Link
          href="/#san-pham"
          className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-accent-dark"
        >
          Xem mẫu cho thuê
        </Link>
      </div>
    </section>
  );
}
