import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig, SITE_URL, mapsDirectionsUrl } from '@/lib/site-config';
import { faqJsonLd, breadcrumbJsonLd } from '@/lib/schema';
import { faqItems, type FaqItem } from '@/lib/faq';
import { getNewArrivals, getProducts } from '@/lib/products';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import type { Product, ProductCategory } from '@/types/product';
import { JsonLd } from '@/components/JsonLd';
import { TrackedContactLink } from '@/components/TrackedContactLink';
import { RevealRoot } from '@/components/hang/RevealRoot';
import { TrangThaiMoCua } from '@/components/gioi-thieu/TrangThaiMoCua';

// ISR 1 giờ: ảnh trên trang đi theo catalogue bên app.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp',
  description: `Giải đáp các câu hỏi thường gặp khi thuê đồ tại ${siteConfig.name}: đặt cọc, thời gian thuê, cách giữ mẫu, giao hàng, thanh toán...`,
  alternates: { canonical: '/cau-hoi-thuong-gap' },
};

/**
 * Câu hỏi xếp theo đúng thứ tự một lần thuê: chọn và giữ mẫu, nhận đồ, cọc và
 * thời gian, trả đồ. Khớp theo câu hỏi trong lib/faq.ts; câu nào thêm mới mà
 * chưa xếp vào chặng nào thì tự rơi vào chặng cuối, không bao giờ bị mất.
 */
const CHANG: { id: string; ten: string; cau: string[] }[] = [
  {
    id: 'chon-mau',
    ten: 'Chọn và giữ mẫu',
    cau: ['Tiệm có những loại trang phục nào?', 'Làm sao biết mẫu còn size mình cần?', 'Cách giữ mẫu như thế nào?'],
  },
  {
    id: 'nhan-do',
    ten: 'Thử và nhận đồ',
    cau: [
      'Có thể đến thử đồ trực tiếp tại cửa hàng không?',
      'Ở xa có thuê được không? Có giao hàng không?',
      'Thanh toán bằng cách nào?',
    ],
  },
  {
    id: 'coc-thoi-gian',
    ten: 'Cọc và thời gian thuê',
    cau: ['Thuê đồ cần đặt cọc bao nhiêu?', 'Thời gian thuê là bao lâu?'],
  },
  { id: 'tra-do', ten: 'Trả đồ', cau: ['Nếu trả trễ hẹn hoặc lỡ làm hư đồ thì sao?'] },
];

function xepChang(ds: FaqItem[]) {
  const daXep = new Set(CHANG.flatMap((c) => c.cau));
  const conLai = ds.filter((f) => !daXep.has(f.question));
  return CHANG.map((c, i) => ({
    ...c,
    muc: [
      ...c.cau.map((q) => ds.find((f) => f.question === q)).filter((f): f is FaqItem => !!f),
      ...(i === CHANG.length - 1 ? conLai : []),
    ],
  })).filter((c) => c.muc.length > 0);
}

/** Ảnh mẫu thật của tiệm, không trùng, ưu tiên mẫu mới về. */
function chonAnh(nguon: Product[], loai: ProductCategory[], soAnh: number, bo: Set<string>): string[] {
  const ds: string[] = [];
  for (const p of nguon) {
    if (!p.image || bo.has(p.image) || !loai.includes(p.category)) continue;
    bo.add(p.image);
    ds.push(p.image);
    if (ds.length >= soAnh) break;
  }
  return ds;
}

/** Ô ảnh vuông góc, phủ kín khung. */
function Anh({ src, sizes, className = '', priority }: { src?: string; sizes: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-tint ${className}`}>
      {src && (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes={sizes}
          className="object-cover"
        />
      )}
    </div>
  );
}

/** Vị trí ảnh cạnh từng chặng — mỗi chặng một cỡ, một độ lệch khác nhau. */
const VI_TRI_ANH = [
  'lg:col-span-3 lg:col-start-9 aspect-[3/4]',
  'lg:col-span-4 lg:col-start-8 lg:mt-16 aspect-[4/3]',
  'lg:col-span-3 lg:col-start-8 lg:mt-6 aspect-square',
  'lg:col-span-4 lg:col-start-9 aspect-[16/10]',
];

const nutDen =
  'inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97]';
const lienKet =
  'font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-accent-dark';

export default async function FaqPage() {
  const [moiVe, tatCa] = await Promise.all([getNewArrivals(12), getProducts()]);
  const nguon = [...moiVe, ...tatCa];
  const bo = new Set<string>();
  const anhKhamPha = chonAnh(nguon, ['dam-vay'], 6, bo);
  const anhChang = chonAnh(nguon, ['dam-vay', 'ao-dai', 'phap-phuc'], 4, bo);
  const anhCuoi = chonAnh(nguon, ['dam-vay', 'ao-dai'], 3, bo);
  const anhHoi = chonAnh(nguon, ['dam-vay', 'ao-dai'], 1, bo)[0];
  const chang = xepChang(faqItems);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: 'Câu hỏi thường gặp', url: `${SITE_URL}/cau-hoi-thuong-gap` },
  ]);

  return (
    <>
      <JsonLd data={faqJsonLd(faqItems)} id="ld-faq" />
      <JsonLd data={breadcrumb} id="ld-breadcrumb-faq" />
      <RevealRoot />

      {/* Đầu trang: chữ bên trái, khảm ảnh đầm trên nền đậm hơn một bậc bên phải. */}
      <section className="grid md:min-h-[calc(100svh-6.5rem)] md:grid-cols-2">
        <div className="hd-le flex flex-col justify-between gap-10 pb-10 pt-8 md:pb-14 md:pt-16">
          <div>
            <h1 className="font-serif text-[clamp(2.4rem,10.5vw,3rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink md:max-w-[9ch] md:text-[clamp(52px,6.4vw,108px)] md:leading-[0.98]">
              Hỏi đáp khi thuê đồ
            </h1>
            <p className="mt-5 max-w-[38ch] text-[17px] leading-relaxed text-ink md:text-lg">
              Cọc, thời gian thuê, giữ mẫu, giao hàng: mọi điều khách hay hỏi trước khi thuê đầm, áo dài
              ở {siteConfig.name}, xếp theo đúng thứ tự một lần thuê.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href="#chon-mau" className={nutDen}>
              Xem câu trả lời
            </a>
            <TrackedContactLink href={siteConfig.messengerUrl} kieu="messenger" viTri="hoi-dap" className={`text-[15px] ${lienKet}`}>
              Hỏi thẳng qua Messenger
            </TrackedContactLink>
          </div>
        </div>

        <div aria-hidden="true" className="relative h-[300px] overflow-hidden bg-tint md:h-auto">
          {/* Điện thoại: hai cột, cột phải thấp hơn 48px, hàng cuối bị mép dưới cắt. */}
          <div className="hd-le grid grid-cols-2 gap-3 pt-4 md:hidden">
            {[0, 1, 2, 3].map((i) => (
              <Anh
                key={i}
                src={anhKhamPha[i]}
                priority={i < 2}
                sizes="50vw"
                className={`aspect-[3/4] ${i % 2 === 1 ? 'translate-y-12' : ''} ${i === 0 ? 'hd-man' : ''}`}
              />
            ))}
          </div>
          {/* Máy tính: lưới 4×3, một ô đôi, vài ô bỏ trống, cột phải tràn khỏi mép. */}
          <div className="absolute inset-y-0 left-0 hidden w-[118%] grid-cols-4 grid-rows-3 gap-3.5 p-8 pr-0 md:grid">
            <Anh src={anhKhamPha[0]} sizes="12vw" className="col-start-1 row-start-2" />
            <Anh src={anhKhamPha[1]} priority sizes="25vw" className="hd-man col-span-2 col-start-2 row-span-2 row-start-1" />
            <Anh src={anhKhamPha[2]} sizes="12vw" className="col-start-4 row-start-1" />
            <Anh src={anhKhamPha[3]} sizes="12vw" className="col-start-2 row-start-3" />
            <Anh src={anhKhamPha[4]} sizes="12vw" className="col-start-4 row-start-3" />
            <Anh src={anhKhamPha[5]} sizes="12vw" className="col-start-1 row-start-3 md:hidden xl:block" />
          </div>
        </div>
      </section>

      {/* Biết nhanh + chuyển tới từng chặng. */}
      <section aria-labelledby="hd-nhanh" className="hd-le pt-16 md:pt-28" data-reveal-nhom>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-6">
            <h2 id="hd-nhanh" data-reveal className="font-serif text-[1.875rem] leading-tight text-ink lg:text-[2.5rem]">
              Biết nhanh
            </h2>
            <dl data-reveal className="mt-6 space-y-4 text-[17px] text-ink md:text-lg">
              <div>
                <dt className="text-[15px] text-ink/70">Địa chỉ</dt>
                <dd>
                  <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className={lienKet}>
                    {siteConfig.address.full}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[15px] text-ink/70">Giờ mở cửa</dt>
                <dd>
                  {siteConfig.openingHours.opens} – {siteConfig.openingHours.closes}, cả tuần.{' '}
                  <TrangThaiMoCua className="block font-medium" />
                </dd>
              </div>
              <div>
                <dt className="text-[15px] text-ink/70">Giữ mẫu</dt>
                <dd>
                  Nhắn{' '}
                  <TrackedContactLink href={siteConfig.messengerUrl} kieu="messenger" viTri="hoi-dap" className={lienKet}>
                    Messenger
                  </TrackedContactLink>{' '}
                  kèm mã mẫu.
                </dd>
              </div>
            </dl>
          </div>
          <nav aria-label="Các chặng hỏi đáp" data-reveal className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <ul className="grid grid-cols-2 gap-2">
              {chang.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="flex min-h-[56px] items-center justify-between gap-3 bg-tint/60 px-4 py-3 text-base text-ink transition hover:bg-tint active:scale-[0.98]"
                  >
                    <span>{c.ten}</span>
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-ink/60" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6l5 5 5-5" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Bốn chặng: câu hỏi bên trái, mỗi chặng một ảnh khác cỡ bên phải (máy tính). */}
      <div className="hd-le pb-24 pt-8 md:pb-36">
        {chang.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`hd-${c.id}`}
            className="grid scroll-mt-28 gap-10 pt-14 md:pt-28 lg:grid-cols-12 lg:gap-x-6"
            data-reveal-nhom
          >
            <div className="lg:col-span-6">
              <h2 id={`hd-${c.id}`} data-reveal className="font-serif text-[1.875rem] leading-tight text-ink lg:text-[2.5rem]">
                {c.ten}
              </h2>
              <div data-reveal className="mt-5 space-y-1 md:mt-7">
                {c.muc.map((f, j) => (
                  <details key={f.question} open={i === 0 && j === 0} className="hd-cau group">
                    <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg leading-snug text-ink transition-colors hover:text-accent-dark md:text-xl [&::-webkit-details-marker]:hidden">
                      <span>{f.question}</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6l5 5 5-5" />
                      </svg>
                    </summary>
                    <p className="max-w-[60ch] pb-5 pt-1 text-[17px] leading-[1.6] text-ink">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
            {anhChang[i] && (
              <div data-reveal className={`hidden lg:block ${VI_TRI_ANH[i % VI_TRI_ANH.length]}`}>
                <Anh src={anhChang[i]} sizes="35vw" className="h-full w-full" />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Hỏi thêm — một câu, một ảnh nhỏ, hai cách liên hệ. */}
      <section aria-labelledby="hd-them" className="hd-le pb-20 md:pb-32" data-reveal-nhom>
        <div className="grid gap-8 md:grid-cols-12 md:gap-x-6">
          <p data-reveal className="max-w-[24ch] font-serif text-2xl leading-[1.2] text-ink md:col-span-6 lg:col-span-5 lg:text-[clamp(26px,2.6vw,36px)]">
            Câu bạn cần hỏi chưa có ở đây? Nhắn tiệm, kèm mã mẫu nếu bạn đang xem một mẫu cụ thể.
          </p>
          <div data-reveal className="flex gap-5 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <Anh src={anhHoi} sizes="160px" className="aspect-square w-24 shrink-0 lg:w-40" />
            <div>
              <h2 id="hd-them" className="text-lg font-medium text-ink">
                Muốn hỏi nhanh?
              </h2>
              <ul className="mt-3 space-y-2 text-[17px]">
                <li>
                  <TrackedContactLink href={siteConfig.messengerUrl} kieu="messenger" viTri="hoi-dap" className={lienKet}>
                    Nhắn Messenger
                  </TrackedContactLink>
                </li>
                <li>
                  <TrackedContactLink href={`tel:${siteConfig.phone.tel}`} kieu="goi" viTri="hoi-dap" className={lienKet}>
                    Gọi {siteConfig.phone.display}
                  </TrackedContactLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lời cuối: ba ảnh sát nhau, rồi một dải màu. */}
      <section aria-labelledby="hd-cuoi">
        {anhCuoi.length === 3 && (
          <div aria-hidden="true" className="grid grid-cols-2 md:grid-cols-3">
            <Anh src={anhCuoi[0]} sizes="(max-width: 768px) 100vw, 33vw" className="col-span-2 aspect-[4/3] md:col-span-1 md:aspect-auto md:h-[40svh]" />
            <Anh src={anhCuoi[1]} sizes="(max-width: 768px) 50vw, 33vw" className="aspect-square md:aspect-auto md:h-[40svh]" />
            <Anh src={anhCuoi[2]} sizes="(max-width: 768px) 50vw, 33vw" className="aspect-square md:aspect-auto md:h-[40svh]" />
          </div>
        )}
        <div className="hd-le flex min-h-[36svh] flex-col justify-center bg-accent-dark py-14 text-surface md:min-h-[44svh]">
          <h2 id="hd-cuoi" className="font-serif text-[1.75rem] leading-tight md:text-[2.5rem]">
            Sẵn sàng chọn đồ?
          </h2>
          <p className="mt-4 max-w-[36ch] text-[22px] leading-snug md:text-[28px]">
            Mở{' '}
            <Link
              href="/#san-pham"
              className="underline decoration-surface decoration-[4px] underline-offset-[6px] transition hover:decoration-tint"
            >
              bộ sưu tập
            </Link>
            , chọn mẫu ưng ý rồi nhắn tiệm giữ ngày.
          </p>
          <p className="mt-8 text-base text-surface/85">
            {siteConfig.address.full} · {siteConfig.openingHours.opens} – {siteConfig.openingHours.closes} hằng ngày
          </p>
        </div>
      </section>
    </>
  );
}
