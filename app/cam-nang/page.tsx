import type { Metadata } from 'next';
import Link from 'next/link';
import { BAI_VIET } from '@/lib/cam-nang';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { breadcrumbJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Cẩm nang thuê đồ',
  description: `Kinh nghiệm thuê áo dài, đầm dự tiệc: giá thuê, cách chọn size, chọn màu theo dịp và cách giữ mẫu tại ${siteConfig.name}, ${siteConfig.address.district}.`,
  alternates: { canonical: '/cam-nang' },
};

export default function CamNangPage() {
  const ds = [...BAI_VIET].sort((a, b) =>
    (b.ngaySua ?? b.ngayDang).localeCompare(a.ngaySua ?? a.ngayDang),
  );

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-cam-nang"
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', url: `${SITE_URL}/` },
          { name: 'Cẩm nang', url: `${SITE_URL}/cam-nang` },
        ])}
      />
      <div className="container-content pb-16 pt-8 sm:pt-14">
        <div className="mx-auto max-w-[68ch]">
          <h1 className="font-serif text-[clamp(2.2rem,8vw,3.4rem)] leading-[1.15] text-ink">
            Cẩm nang thuê đồ
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink">
            Giá thuê, cách chọn size, chọn màu theo dịp và kinh nghiệm thuê đầm, áo dài, tổng hợp
            từ những câu khách hỏi {siteConfig.name} nhiều nhất.
          </p>

          <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
            {ds.map((b) => (
              <li key={b.slug}>
                <Link href={`/cam-nang/${b.slug}`} className="group block py-6">
                  <h2 className="font-serif text-xl leading-snug text-ink transition group-hover:text-accent-dark sm:text-2xl">
                    {b.tieuDe}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted">{b.moTa}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
