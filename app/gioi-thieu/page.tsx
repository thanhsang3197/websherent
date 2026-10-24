import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig, SITE_URL, mapsDirectionsUrl } from '@/lib/site-config';
import { getNewArrivals, getRentalProducts } from '@/lib/products';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import { breadcrumbJsonLd } from '@/lib/schema';
import type { Product, ProductCategory } from '@/types/product';
import { JsonLd } from '@/components/JsonLd';
import { Brand } from '@/components/Brand';
import { ACoSuKien } from '@/components/LinkCoSuKien';
import { TrackedContactLink } from '@/components/TrackedContactLink';
import { RevealRoot } from '@/components/hang/RevealRoot';
import { SanKhau } from '@/components/gioi-thieu/SanKhau';
import { TrangThaiMoCua } from '@/components/gioi-thieu/TrangThaiMoCua';

// ISR 1 giờ: ảnh trên trang đi theo catalogue bên app.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: `Về ${siteConfig.name} — cửa hàng cho thuê váy đầm dự tiệc, áo dài, pháp phục và đồ bà ba tại ${siteConfig.address.district}, ${siteConfig.address.city}, hỗ trợ giao hàng toàn quốc.`,
  alternates: { canonical: '/gioi-thieu' },
};

/** Ảnh mẫu thật của tiệm thuộc các dòng cho trước, không trùng, ưu tiên mẫu mới về. */
function chonAnh(nguon: Product[], loai: ProductCategory[], soAnh: number, bo = new Set<string>()): string[] {
  const ds: string[] = [];
  for (const p of nguon) {
    if (!p.image || bo.has(p.image) || !loai.includes(p.category)) continue;
    bo.add(p.image);
    ds.push(p.image);
    if (ds.length >= soAnh) break;
  }
  return ds;
}

/** Các bước thuê, in như một tờ phiếu. Chỉ ghi những gì tiệm đã nói ở trang Hỏi đáp. */
const PHIEU: { nhom: string; dong: { viec: string; khi: string }[] }[] = [
  {
    nhom: 'Chọn đồ',
    dong: [
      { viec: 'Xem mẫu trên web', khi: 'lúc nào cũng được' },
      { viec: 'Nhắn Messenger kèm mã mẫu', khi: 'giữ mẫu, chốt ngày' },
      { viec: 'Hỏi size nếu chưa chắc', khi: 'trước khi giữ' },
    ],
  },
  {
    nhom: 'Nhận đồ',
    dong: [
      { viec: 'Ghé tiệm thử và nhận', khi: `${siteConfig.openingHours.opens} – ${siteConfig.openingHours.closes}` },
      { viec: 'Hoặc nhận đồ gửi tận nơi', khi: 'toàn quốc' },
      { viec: 'Thanh toán', khi: 'tiền mặt, chuyển khoản' },
    ],
  },
  {
    nhom: 'Mặc và trả',
    dong: [
      { viec: 'Thuê 1 ngày', khi: 'trả trước 20:00 hôm sau' },
      { viec: 'Thuê 3 ngày', khi: 'nhận, mặc, trả' },
      { viec: 'Trả đồ đúng hẹn', khi: 'nhận lại đủ cọc' },
    ],
  },
];

/** Cạnh dưới răng cưa cho tờ phiếu. */
const RANG = 28;
const CAT_PHIEU = `polygon(0 0, 100% 0, ${Array.from({ length: RANG * 2 + 1 }, (_, i) => {
  const x = 100 - (i * 100) / (RANG * 2);
  return `${x.toFixed(3)}% ${i % 2 === 0 ? 'calc(100% - 10px)' : '100%'}`;
}).join(', ')})`;

const lienKetSang = 'underline decoration-surface/40 underline-offset-4 transition hover:decoration-surface';

export default async function GioiThieuPage() {
  const [moiVe, tatCa] = await Promise.all([getNewArrivals(12), getRentalProducts()]);
  const nguon = [...moiVe, ...tatCa];
  const daDung = new Set<string>();
  const anhGuong = chonAnh(nguon, ['dam-vay'], 3, daDung);
  const anhDai = chonAnh(nguon, ['dam-vay', 'ao-dai', 'phap-phuc'], 12, daDung);
  // Băng ảnh chạy vòng: lặp hai lần để trượt liền mạch.
  const bang = anhDai.length >= 6 ? [...anhDai, ...anhDai] : [];
  const tiLe = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'];

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: 'Giới thiệu', url: `${SITE_URL}/gioi-thieu` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} id="ld-breadcrumb-about" />
      <RevealRoot />

      {/*
        Sân khấu chia đôi: gương vòm đứng yên bên trái, chữ cuộn bên phải.
        Điện thoại: gương dính sau lưng cả màn hình, các khối chữ (gt-tam) trượt
        lên che qua; khoảng hở giữa các khối (gt-cua) là ô cửa nhìn thấy gương
        đã đổi đầm. Từ md trở lên các ô cửa ẩn đi, về lại bố cục hai cột.
      */}
      <div className="gt-le md:grid md:grid-cols-[46fr_54fr] md:gap-x-[clamp(2rem,5vw,5.5rem)]">
        <div className="gt-guong md:pt-6">
          <div className="md:sticky md:top-[7.5rem]">
            <SanKhau anh={anhGuong} />
          </div>
        </div>

        <div className="gt-chu">
          <div data-canh="0" aria-hidden="true" className="gt-cua gt-cua-dau" />
          {/* Đầu trang: câu giới thiệu giữa, tên tiệm chạy dọc mép dưới. */}
          <section
            data-canh="0"
            className="gt-tam flex flex-col pb-12 pt-6 md:min-h-[calc(100svh-7.5rem)] md:pb-8"
          >
            <div className="flex flex-1 flex-col justify-center md:py-12">
              <p className="max-w-[26ch] text-[19px] leading-[1.45] text-ink sm:text-2xl">
                Tiệm cho thuê đầm dự tiệc, áo dài và pháp phục ở {siteConfig.address.district},{' '}
                {siteConfig.address.city}. Thử tại tiệm, hoặc nhận đồ ở tỉnh nào cũng được.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  href="/#san-pham"
                  className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97]"
                >
                  Xem bộ sưu tập
                </Link>
                <a
                  href="#ghe-tiem"
                  className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-accent-dark"
                >
                  Địa chỉ và giờ mở cửa
                </a>
              </div>
            </div>
            <h1 className="gt-ten order-first mb-5 font-serif font-medium uppercase text-ink md:order-none md:mb-0 md:mt-10">
              <span className="sr-only">{siteConfig.name}, cho thuê đầm, váy và áo dài</span>
              <span aria-hidden="true">{siteConfig.name}</span>
            </h1>
          </section>

          <div data-canh="1" aria-hidden="true" className="gt-cua" />

          {/* Thư của tiệm. */}
          <section
            data-canh="1"
            aria-labelledby="gt-thu"
            className="gt-tam py-16 md:py-24 lg:py-40"
            data-reveal-nhom
          >
            <div className="max-w-[46ch]">
              <div data-reveal className="flex items-center gap-4">
                <Image
                  src="/icon-192.png"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full"
                />
                <h2 id="gt-thu" className="font-serif text-[2rem] leading-tight text-ink lg:text-[2.5rem]">
                  Vài lời từ <Brand />
                </h2>
              </div>
              <div data-reveal className="mt-8 space-y-[1.55em] text-[17px] leading-[1.6] text-ink">
                <p>
                  Ai cũng có vài ngày cần thật đẹp: đám cưới của bạn thân, buổi chụp ảnh tốt nghiệp,
                  sáng mùng Một Tết. Nhưng không phải lần nào cũng cần mua một bộ mới để mặc đúng một
                  lần. <Brand /> mở ra cho những ngày như thế.
                </p>
                <p>
                  Tiệm có đầm dự tiệc cho đám cưới, đám hỏi, sinh nhật; váy chụp ảnh tốt nghiệp; áo dài
                  truyền thống và cách tân; cùng pháp phục và đồ bà ba cho những dịp nhẹ nhàng hơn.
                </p>
                <p>
                  Bộ nào trước khi tới tay bạn cũng được{' '}
                  <mark className="bg-tint px-1 text-ink">giặt ủi thơm tho</mark> và kiểm tra kỹ. Chưa
                  chắc size thì cứ hỏi, tiệm tư vấn trước khi bạn giữ mẫu.
                </p>
                <p>
                  Ở gần thì ghé Hóc Môn thử đồ vào buổi chiều tối. Ở xa thì chọn mẫu trên web, nhắn
                  Messenger, tiệm gửi đồ đi khắp các tỉnh.
                </p>
              </div>
              <p data-reveal className="mt-10">
                <span className="block font-serif text-[22px] text-ink">
                  <Brand />
                </span>
                <span className="mt-1 block text-[15px] text-ink/70">
                  Cho thuê đầm và áo dài, {siteConfig.address.district}
                </span>
              </p>
            </div>
          </section>

          {/* Ghé tiệm: giờ mở cửa là con số lớn, kèm trạng thái lúc này. */}
          <div data-canh="2" aria-hidden="true" className="gt-cua" />

          <section
            id="ghe-tiem"
            data-canh="2"
            aria-labelledby="gt-ghe"
            className="gt-tam scroll-mt-32 py-16 md:pb-24 md:pt-0 lg:pb-40"
            data-reveal-nhom
          >
            <h2 id="gt-ghe" data-reveal className="font-serif text-[2rem] leading-tight text-ink lg:text-[2.5rem]">
              Ghé tiệm thử đồ
            </h2>
            <p data-reveal className="gt-gio mt-8 whitespace-nowrap font-serif tabular-nums text-ink">
              {siteConfig.openingHours.opens}–{siteConfig.openingHours.closes}
            </p>
            <div data-reveal className="mt-6 max-w-[46ch] space-y-1 text-[17px] leading-relaxed text-ink">
              <p>Mở cả tuần, từ thứ Hai đến Chủ nhật.</p>
              <p className="font-medium">
                <TrangThaiMoCua />
              </p>
            </div>
            <div data-reveal className="mt-10 bg-tint/60 px-6 py-6 sm:px-8">
              <p className="text-[15px] text-ink/70">Địa chỉ</p>
              <p className="mt-1 text-xl text-ink">{siteConfig.address.full}</p>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-accent-dark"
              >
                Chỉ đường trên Google Maps
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Thuê thế nào — tờ phiếu, chạy hết chiều ngang. */}
      <section aria-labelledby="gt-cach" className="gt-le bg-tint py-24 lg:py-36" data-reveal-nhom>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-5">
            <h2
              id="gt-cach"
              data-reveal
              className="font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] text-ink lg:text-[clamp(40px,4.4vw,68px)]"
            >
              Thuê đồ thế nào
            </h2>
            <p data-reveal className="mt-6 max-w-[30ch] text-[17px] leading-relaxed text-ink">
              Không cần tài khoản, không cần đăng ký. Một tin nhắn Messenger là đủ để giữ mẫu.
            </p>
          </div>
          <div data-reveal className="min-w-0 lg:col-span-6 lg:col-start-7">
            <div className="bg-surface px-6 pb-12 pt-8 sm:px-8" style={{ clipPath: CAT_PHIEU }}>
              <p className="font-serif text-2xl text-ink">
                <Brand />
              </p>
              <p className="text-[15px] text-ink/70">{siteConfig.address.full}</p>
              {PHIEU.map((n) => (
                <div key={n.nhom} className="mt-7">
                  <h3 className="text-base font-semibold text-ink">{n.nhom}</h3>
                  <ul className="mt-2.5 space-y-2 text-base text-ink">
                    {n.dong.map((d) => (
                      <li key={d.viec} className="flex items-baseline gap-2">
                        <span className="min-w-0">{d.viec}</span>
                        <span aria-hidden="true" className="min-w-4 flex-1 overflow-hidden whitespace-nowrap text-ink/30">
                          {'·'.repeat(80)}
                        </span>
                        <span className="max-w-[48%] text-right">{d.khi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="-mx-6 mt-8 flex min-h-[44px] flex-wrap items-center justify-between gap-x-4 bg-ink px-6 py-2.5 text-base text-surface sm:-mx-8 sm:px-8">
                <span>Bộ đồ đẹp cho ngày của bạn</span>
                <span className="whitespace-nowrap">không cần mua mới</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liên hệ — nền đất nung, băng ảnh đầm trôi chậm, ba ô bấm. */}
      <section
        id="lien-he"
        aria-labelledby="gt-lien-he"
        className="overflow-hidden bg-accent-dark pb-20 pt-12 text-surface lg:pb-28"
        data-reveal-nhom
      >
        {bang.length > 0 && (
          <div aria-hidden="true" className="gt-bang flex w-max gap-2">
            {bang.map((src, i) => (
              <span key={`${src}-${i}`} className={`relative block h-[110px] sm:h-[150px] ${tiLe[i % 3]} overflow-hidden bg-tint/20`}>
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="150px"
                  placeholder="blur"
                  blurDataURL={GLASS_BLUR_DATA_URL}
                  className="object-cover"
                />
              </span>
            ))}
          </div>
        )}
        <div className="gt-le mt-14 lg:mt-[72px]">
          <h2
            id="gt-lien-he"
            data-reveal
            className="font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] lg:text-[clamp(36px,4vw,60px)]"
          >
            Nhắn tiệm giữ mẫu
          </h2>
          <div data-reveal className="mt-10 grid items-start gap-2 md:grid-cols-2">
            <div>
              <TrackedContactLink
                href={siteConfig.messengerUrl}
                kieu="messenger"
                viTri="gioi-thieu"
                className="flex min-h-[60px] items-center justify-center bg-surface/15 px-4 text-lg transition hover:bg-surface/25 active:scale-[0.99] md:min-h-[96px]"
              >
                Nhắn Messenger
              </TrackedContactLink>
              <p className="mt-3 text-[15px] text-surface/80">Gửi kèm mã mẫu để tiệm xem size giúp bạn.</p>
            </div>
            <div>
              <TrackedContactLink
                href={`tel:${siteConfig.phone.tel}`}
                kieu="goi"
                viTri="gioi-thieu"
                className="flex min-h-[60px] items-center justify-center bg-surface px-4 text-lg text-ink transition hover:bg-tint active:scale-[0.99] md:min-h-[96px]"
              >
                Gọi {siteConfig.phone.display}
              </TrackedContactLink>
              <p className="mt-3 text-[15px] text-surface/80">
                Trong giờ mở cửa, {siteConfig.openingHours.opens} – {siteConfig.openingHours.closes}.
              </p>
            </div>
          </div>
          <ul data-reveal className="mt-12 flex flex-wrap gap-x-7 gap-y-2 text-[15px]">
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'gioi-thieu', kenh: 'Facebook' }}
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={lienKetSang}
              >
                Facebook
              </ACoSuKien>
            </li>
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'gioi-thieu', kenh: 'Instagram váy' }}
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={lienKetSang}
              >
                Instagram váy thiết kế
              </ACoSuKien>
            </li>
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'gioi-thieu', kenh: 'Instagram áo dài' }}
                href={siteConfig.instagramUrl2}
                target="_blank"
                rel="noopener noreferrer"
                className={lienKetSang}
              >
                Instagram áo dài
              </ACoSuKien>
            </li>
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'gioi-thieu', kenh: 'TikTok' }}
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={lienKetSang}
              >
                TikTok
              </ACoSuKien>
            </li>
          </ul>
        </div>
      </section>

      {/* Lời cuối: một câu, một nút. */}
      <section aria-labelledby="gt-cuoi" className="gt-le pb-[16svh] pt-[22svh]" data-reveal-nhom>
        <div className="md:ml-[calc(46%+clamp(2rem,5vw,5.5rem)*0.46)]">
          <h2 id="gt-cuoi" data-reveal className="max-w-[34ch] font-sans text-xl font-normal leading-snug text-ink">
            Ưng mẫu nào thì cứ nhắn, tiệm giữ ngày cho bạn.
          </h2>
          <div data-reveal className="mt-6">
            <Link
              href="/#san-pham"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-ink px-6 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97]"
            >
              Xem bộ sưu tập
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
