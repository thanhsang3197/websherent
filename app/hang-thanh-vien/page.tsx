import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getHangKhach, getNewArrivals, getProducts } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import { TEN_HANG_MOI, dieuKien, dongQuyenLoi, mauHang, type DongQuyenLoi } from '@/lib/hang-khach';
import { breadcrumbJsonLd } from '@/lib/schema';
import type { Product } from '@/types/product';
import type { HangKhach } from '@/types/hang-khach';
import { JsonLd } from '@/components/JsonLd';
import { TrackedContactLink } from '@/components/TrackedContactLink';
import { HangHero, type MucHero } from '@/components/hang/HangHero';
import { HangTinh } from '@/components/hang/HangTinh';
import { HangHoiDap, type PhieuHoiDap } from '@/components/hang/HangHoiDap';
import { RevealRoot } from '@/components/hang/RevealRoot';

// ISR 1 giờ, cùng nhịp với dữ liệu hạng (lib/internal-api.ts): shop sửa ngưỡng
// hay quyền lợi ở app (Khách hàng → tab Hạng KH) là trang đổi theo, không cần deploy.
export const revalidate = 3600;

const TITLE = 'Hạng thành viên';
const DESCRIPTION =
  `Tích điểm theo phí thuê đầm, váy, áo dài tại ${siteConfig.name}: lên hạng Bạc, Vàng, ` +
  `Kim Cương để được giảm phí thuê và miễn phí thuê phụ kiện. Không cần đăng ký.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/hang-thanh-vien' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/hang-thanh-vien`,
    images: [{ url: siteConfig.ogImage }],
  },
};

const so = (n: number) => n.toLocaleString('vi-VN');

/**
 * Ảnh đầm thật của tiệm cho các khung trên trang: ưu tiên mẫu mới về, rồi tới
 * đầm/váy trong catalogue. Không trùng ảnh, chỉ lấy mẫu có ảnh.
 */
function chonAnh(nguon: Product[], soAnh: number): string[] {
  const thay = new Set<string>();
  const ds: string[] = [];
  for (const p of nguon) {
    if (!p.image || thay.has(p.image) || p.category !== 'dam-vay') continue;
    thay.add(p.image);
    ds.push(p.image);
    if (ds.length >= soAnh) break;
  }
  return ds;
}

/** "giảm 15% phí thuê, miễn phí thuê phụ kiện" — câu ngắn dưới thẻ hero. */
function tomTatQuyenLoi(h: HangKhach): string {
  const ds: string[] = [];
  if (h.giamPhanTram > 0) ds.push(`giảm ${h.giamPhanTram}% phí thuê`);
  if (h.freePhuKien) ds.push('miễn phí thuê phụ kiện');
  ds.push(...h.quyenLoiKhac.map((q) => q.charAt(0).toLowerCase() + q.slice(1)));
  return ds.join(', ');
}

export default async function HangThanhVienPage() {
  const [ct, moiVe, tatCa] = await Promise.all([getHangKhach(), getNewArrivals(12), getProducts()]);
  const anh = chonAnh([...moiVe, ...tatCa], 9);
  const a = (i: number) => anh[i % Math.max(anh.length, 1)] ?? null;

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: TITLE, url: `${SITE_URL}/hang-thanh-vien` },
  ]);

  if (!ct) return <DangCapNhat breadcrumb={breadcrumb} />;

  const { hang, dongMoiDiem } = ct;
  const cao = hang[hang.length - 1];
  const giamToiDa = Math.max(...hang.map((h) => h.giamPhanTram));
  const hangFreePk = hang.filter((h) => h.freePhuKien).map((h) => h.ten);

  const mucHero: MucHero[] = [
    {
      key: 'moi',
      ten: TEN_HANG_MOI,
      nhan: 'Tích điểm',
      chiTiet: 'Từ lượt thuê đầu tiên, không cần đăng ký. Mỗi lượt thuê đưa bạn tới gần hạng Bạc hơn.',
      anh: a(0),
      mau: mauHang(null),
    },
    ...hang.map((h, i) => ({
      key: h.ma,
      ten: h.ten,
      nhan: h.giamPhanTram > 0 ? `Giảm ${h.giamPhanTram}%` : 'Quà tặng',
      chiTiet: `Từ ${dieuKien(h)}: ${tomTatQuyenLoi(h)}.`,
      anh: a(i + 1),
      mau: mauHang(h),
    })),
  ];

  const nhomQuyenLoi: { ten: string; dieuKien: string; mau: string; dong: DongQuyenLoi[] }[] = [
    {
      ten: TEN_HANG_MOI,
      dieuKien: 'Từ lượt thuê đầu tiên',
      mau: mauHang(null).nen,
      dong: [
        { ten: 'Tích điểm', giaTri: `1 điểm / ${so(dongMoiDiem)} đ`, ghiChu: 'Tính trên phí thuê, không tính tiền cọc' },
        { ten: 'Đăng ký', giaTri: 'Không cần', ghiChu: 'Thuê là đã là thành viên' },
      ],
    },
    ...hang.map((h) => ({ ten: h.ten, dieuKien: `Từ ${dieuKien(h)}`, mau: mauHang(h).nen, dong: dongQuyenLoi(h) })),
  ];

  const mauPhieu = [mauHang(null).nen, ...hang.map((h) => mauHang(h).nen)];
  const phieu: PhieuHoiDap[] = [
    {
      tab: 'Đăng ký',
      hoi: 'Có cần đăng ký không?',
      dap: `Không cần. Bạn thuê đồ ở ${siteConfig.name} là đã là thành viên, điểm và lượt thuê tiệm tự ghi lại cho bạn.`,
    },
    {
      tab: 'Tính điểm',
      hoi: 'Điểm tính trên khoản nào?',
      dap: `Trên phí thuê bạn trả: cứ ${so(dongMoiDiem)} đ là 1 điểm. Tiền cọc là khoản hoàn lại nên không tính điểm.`,
    },
    {
      tab: 'Lượt thuê',
      hoi: 'Lượt thuê tính khi nào?',
      dap: 'Khi bạn đã trả đồ. Đơn đang thuê, chưa trả đồ thì chưa được tính vào hạng.',
    },
    {
      tab: 'Áp giảm',
      hoi: 'Giảm theo hạng áp thế nào?',
      dap: 'Nhân viên tự trừ phần giảm vào phí thuê khi lên đơn ở quầy.',
    },
    {
      tab: 'Voucher',
      hoi: 'Có dùng chung voucher?',
      dap: 'Giảm theo hạng không cộng dồn với voucher: có cả hai thì tiệm áp ưu đãi lớn hơn cho bạn.',
    },
    ...(hangFreePk.length > 0
      ? [
          {
            tab: 'Phụ kiện',
            hoi: 'Phụ kiện miễn phí có cọc?',
            // Chủ shop chốt 22/10/2026: phụ kiện miễn phí thì KHÔNG thu cọc phụ kiện
            // (cọc váy vẫn thu) — khác api-cong-khai.md §2.7 ("cọc vẫn thu").
            dap: `Không. Hạng ${hangFreePk.join(', ')} được miễn phí thuê và không cần đặt cọc phụ kiện.`,
          },
        ]
      : []),
  ].map((p, i) => ({ ...p, nen: mauPhieu[i % mauPhieu.length] }));

  const buoc = [
    {
      ten: 'Thuê đầm',
      chu: `Không cần đăng ký. Cứ ${so(dongMoiDiem)} đ phí thuê là 1 điểm, tiền cọc không tính.`,
      lop: 'md:col-span-3',
      cao: 'h-[52vw] md:h-[max(30vh,15rem)]',
      khung: 'h-[78%]',
      nen: mauHang(null).nen,
      anh: a(5),
    },
    {
      ten: 'Trả đồ',
      chu: 'Trả đồ xong, lượt thuê đó mới được tính vào hạng của bạn.',
      lop: 'md:col-span-4',
      cao: 'h-[66vw] md:h-[max(44vh,21rem)]',
      khung: 'h-[82%]',
      nen: mauHang(hang[0]).nen,
      anh: a(6),
    },
    {
      ten: 'Lên hạng',
      chu: `Đủ cả điểm lẫn lượt là lên hạng, giảm tới ${giamToiDa}% phí thuê từ lần thuê kế tiếp.`,
      lop: 'md:col-span-5 md:row-span-2',
      cao: 'h-[82vw] md:h-[max(60vh,28rem)]',
      khung: 'h-[86%]',
      nen: mauHang(cao).nen,
      anh: a(7),
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumb} id="ld-breadcrumb-hang" />
      <RevealRoot />

      <HangHero items={mucHero}>
        {/* Một trục giữa cho cả khối: tiêu đề, câu dẫn, nút và dải thẻ bên dưới. */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1
            id="hang-tieu-de"
            className="font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] text-ink sm:text-[clamp(2.75rem,4.4vw,4rem)]"
          >
            Hạng thành viên {siteConfig.name}
          </h1>
          <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink">
            Mỗi {so(dongMoiDiem)} đ phí thuê tích 1 điểm. Hạng càng cao, ưu đãi càng lớn: giảm đến{' '}
            {giamToiDa}% cho mỗi lần thuê.
          </p>
          <a
            href="#tinh-hang"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97]"
          >
            Tính hạng của bạn
          </a>
        </div>
      </HangHero>

      {/* Lên hạng thế nào — ba ô lớn dần theo thứ tự. */}
      <section aria-labelledby="hang-buoc" className="container-content py-20 sm:py-32" data-reveal-nhom>
        <div className="grid gap-7 md:grid-cols-12 md:items-end md:gap-x-3 md:gap-y-0">
          <h2
            id="hang-buoc"
            data-reveal
            className="font-serif text-[1.875rem] leading-tight text-ink md:col-span-7 md:row-start-1 md:self-start md:pb-10 md:text-5xl"
          >
            Lên hạng thế nào
          </h2>
          {buoc.map((b, i) => (
            <figure
              key={b.ten}
              data-reveal
              className={`${b.lop} ${i < 2 ? 'md:row-start-2' : 'md:row-start-1'}`}
            >
              <div
                className={`relative flex items-end justify-center overflow-hidden rounded-2xl ${b.cao}`}
                style={{ backgroundColor: b.nen }}
              >
                {b.anh && (
                  <span className={`arch relative block aspect-[2/3] overflow-hidden ${b.khung}`}>
                    <Image
                      src={b.anh}
                      alt=""
                      fill
                      placeholder="blur"
                      blurDataURL={GLASS_BLUR_DATA_URL}
                      sizes="(max-width: 768px) 60vw, 30vw"
                      className={`object-cover ${i === 2 ? 'hang-troi' : ''}`}
                    />
                  </span>
                )}
              </div>
              <figcaption className="mt-4 pr-4">
                <span className="block text-xl font-medium text-ink">{b.ten}</span>
                <span className="mt-1 block max-w-[34ch] text-base leading-relaxed text-ink">{b.chu}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Ô tự tính hạng. */}
      <section
        id="tinh-hang"
        aria-labelledby="hang-tinh-tieu-de"
        className="scroll-mt-28 bg-surface py-20 sm:py-28"
        data-reveal-nhom
      >
        <div className="container-content">
          <h2
            id="hang-tinh-tieu-de"
            data-reveal
            className="font-serif text-[1.875rem] leading-tight text-ink md:text-5xl"
          >
            Bạn đang ở hạng nào?
          </h2>
          <p data-reveal className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink">
            Nhập số điện thoại bạn dùng khi thuê để xem hạng hiện tại, hoặc kéo thử tổng phí thuê
            (không tính tiền cọc) và số lượt để ước tính còn bao xa tới hạng kế.
          </p>
          <div className="mt-12">
            <HangTinh dsHang={hang} dongMoiDiem={dongMoiDiem} />
          </div>
        </div>
      </section>

      {/* Quyền lợi từng hạng — đặt như bảng giá trong thực đơn. */}
      <section aria-labelledby="hang-quyen-loi" className="container-content py-20 sm:py-32" data-reveal-nhom>
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <h2
              id="hang-quyen-loi"
              data-reveal
              className="font-serif text-[1.875rem] leading-tight text-ink md:text-5xl"
            >
              Quyền lợi từng hạng
            </h2>
            {a(4) && (
              <div data-reveal className="arch relative mt-8 aspect-[4/5] w-3/5 overflow-hidden md:w-full">
                <Image
                  src={a(4) as string}
                  alt=""
                  fill
                  placeholder="blur"
                  blurDataURL={GLASS_BLUR_DATA_URL}
                  sizes="(max-width: 768px) 60vw, 25vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:col-span-8 md:grid-cols-2 lg:col-span-8 lg:col-start-5">
            {nhomQuyenLoi.map((n) => (
              // Mỗi hạng một ô nền màu của hạng đó — nhìn màu là biết đang đọc hạng nào.
              <div
                key={n.ten}
                data-reveal
                className="rounded-2xl px-6 py-7 sm:px-7"
                style={{ backgroundColor: `color-mix(in srgb, ${n.mau} 60%, rgb(var(--surface)))` }}
              >
                <h3 className="font-serif text-[1.75rem] leading-tight text-ink">{n.ten}</h3>
                <p className="mt-1 text-base text-ink">{n.dieuKien}</p>
                <dl className="mt-6 space-y-[22px]">
                  {n.dong.map((d) => (
                    <div key={d.ten}>
                      <div className="flex items-baseline justify-between gap-4 text-xl text-ink">
                        <dt>{d.ten}</dt>
                        <dd className="shrink-0 font-medium tabular-nums">{d.giaTri}</dd>
                      </div>
                      {d.ghiChu && <p className="mt-0.5 max-w-[36ch] text-base text-ink/70">{d.ghiChu}</p>}
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hỏi đáp — xấp phiếu có tab. */}
      <section aria-labelledby="hang-hoi-dap" className="container-content pb-20 sm:pb-32" data-reveal-nhom>
        <div className="md:mx-auto md:w-10/12 lg:w-8/12">
          <h2
            id="hang-hoi-dap"
            data-reveal
            className="font-serif text-[1.875rem] leading-tight text-ink md:text-5xl"
          >
            Hỏi nhanh về hạng
          </h2>
          <div className="mt-10">
            <HangHoiDap phieu={phieu} />
          </div>
        </div>
      </section>

      {/* Lời mời cuối — một hàng ba ô, hai ô bên chạy ra mép màn hình. */}
      <section aria-labelledby="hang-moi" className="overflow-hidden pb-20 sm:pb-28" data-reveal-nhom>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_minmax(0,52rem)_1fr]">
          <div
            data-reveal
            className="relative order-2 h-32 overflow-hidden rounded-2xl md:order-none md:-ml-6 md:h-[22.5rem]"
            style={{ backgroundColor: mauHang(hang[0]).nen }}
          >
            {a(8) && (
              <Image
                src={a(8) as string}
                alt=""
                fill
                placeholder="blur"
                blurDataURL={GLASS_BLUR_DATA_URL}
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
              />
            )}
          </div>
          <div
            data-reveal
            className="order-1 col-span-2 mx-5 flex min-h-[19rem] flex-col justify-center rounded-2xl bg-accent-dark px-6 py-10 text-surface md:order-none md:col-span-1 md:mx-0 md:h-[22.5rem] md:px-10"
          >
            <h2 id="hang-moi" className="font-serif text-[1.875rem] leading-tight md:text-5xl">
              Thuê bộ đầu, tích điểm luôn
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed">
              Chọn đầm, váy, áo dài đang có rồi nhắn tiệm giữ mẫu. Từ lượt đầu tiên là bạn đã bắt đầu
              tích điểm.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/#san-pham"
                className="inline-flex items-center justify-center rounded-full bg-surface px-6 py-3.5 text-[15px] font-medium text-ink transition hover:bg-tint active:scale-[0.97]"
              >
                Xem bộ sưu tập
              </Link>
              <TrackedContactLink
                href={siteConfig.messengerUrl}
                kieu="messenger"
                viTri="hang-thanh-vien"
                className="text-[15px] font-medium underline decoration-surface/50 underline-offset-4 transition hover:decoration-surface"
              >
                Nhắn tin qua Messenger
              </TrackedContactLink>
            </div>
          </div>
          <div
            data-reveal
            aria-hidden="true"
            className="order-3 h-32 rounded-2xl md:order-none md:-mr-6 md:h-[22.5rem]"
            style={{ backgroundColor: mauHang(cao).nen }}
          />
        </div>
      </section>
    </>
  );
}

/** App chưa có route / API lỗi: vẫn giới thiệu chương trình, không bịa ngưỡng. */
function DangCapNhat({ breadcrumb }: { breadcrumb: Record<string, unknown> }) {
  return (
    <div className="container-content py-16 sm:py-24">
      <JsonLd data={breadcrumb} id="ld-breadcrumb-hang" />
      <h1 className="font-serif text-4xl text-ink sm:text-5xl">Hạng thành viên {siteConfig.name}</h1>
      <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink">
        Thuê đồ ở tiệm là bạn đã tích điểm theo phí thuê để lên hạng và được giảm giá. Bảng hạng và
        quyền lợi đang được cập nhật, bạn nhắn tiệm để hỏi chi tiết nhé.
      </p>
      <TrackedContactLink
        href={siteConfig.zaloUrl}
        kieu="zalo"
        viTri="hang-thanh-vien"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-surface transition hover:bg-accent-dark"
      >
        Nhắn Zalo hỏi tiệm
      </TrackedContactLink>
    </div>
  );
}
