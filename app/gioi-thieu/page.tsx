import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, SITE_URL, mapsDirectionsUrl } from '@/lib/site-config';
import { breadcrumbJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ContactButtons } from '@/components/ContactButtons';
import { Brand } from '@/components/Brand';

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: `Về ${siteConfig.name} — cửa hàng cho thuê váy đầm dự tiệc, áo dài, pháp phục và đồ bà ba tại ${siteConfig.address.district}, ${siteConfig.address.city}, hỗ trợ giao hàng toàn quốc.`,
  alternates: { canonical: '/gioi-thieu' },
};

/** Tiêu đề mục — to & đậm hơn mặc định để nổi bật nội dung chính. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-3xl font-semibold text-accent-dark">
      {children}
    </h2>
  );
}

export default function GioiThieuPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: 'Giới thiệu', url: `${SITE_URL}/gioi-thieu` },
  ]);

  return (
    <article className="container-content py-14">
      <JsonLd data={breadcrumb} id="ld-breadcrumb-about" />

      {/* Breadcrumb hiển thị */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">Giới thiệu</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-accent-dark sm:text-5xl">
          <Brand /> – Tỏa Sáng Trong Mọi Khung Hình
        </h1>
        <div className="rule-accent mt-5" />
      </header>

      <div className="mt-8 max-w-2xl space-y-6 leading-relaxed text-ink/90">
        <SectionHeading>Về Chúng Tôi</SectionHeading>
        <p>
          <strong>
            <Brand />
          </strong>{' '}
          là cửa hàng chuyên cho thuê váy đầm dự tiệc và áo dài thiết kế tại{' '}
          {siteConfig.address.full}. Chúng tôi ra đời với sứ mệnh mang đến cho
          bạn những bộ trang phục hoàn hảo nhất cho các dịp đặc biệt mà không
          cần tốn kém mua mới. Tiêu chí hàng đầu của <Brand /> là mang lại{' '}
          <strong>trải nghiệm dịch vụ tử tế</strong>, giúp bạn{' '}
          <strong>tiết kiệm chi phí tối đa</strong> nhưng vẫn luôn bắt kịp
          những xu hướng thời trang mới nhất.
        </p>

        <SectionHeading>
          Dịch Vụ Của <Brand />
        </SectionHeading>
        <p>
          Bộ sưu tập tại tiệm cực kỳ đa dạng để bạn thoải mái lựa chọn cho mọi
          dịp quan trọng. Chúng tôi cung cấp các dòng{' '}
          <strong>váy đầm dự tiệc sang trọng</strong> (đám cưới, hỏi, sinh
          nhật), <strong>váy chụp ảnh tốt nghiệp</strong>,{' '}
          <strong>áo dài truyền thống và cách tân</strong>. Bên cạnh đó,{' '}
          <Brand /> còn có sẵn các mẫu{' '}
          <strong>pháp phục thanh lịch</strong> và{' '}
          <strong>đồ bà ba duyên dáng</strong>. Mỗi trang phục trước khi giao
          đều được giặt ủi thơm tho và chuẩn bị chu đáo để bạn tự tin tỏa
          sáng.
        </p>

        <SectionHeading>Địa Chỉ &amp; Khu Vực Phục Vụ</SectionHeading>

        <p>
          Cửa hàng tọa lạc tại địa chỉ{' '}
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent-dark underline underline-offset-4"
          >
            {siteConfig.address.full}
          </a>{' '}
          để bạn có thể ghé trực tiếp trải nghiệm và thử đồ. Nhằm phục vụ nhu
          cầu làm đẹp của mọi cô gái, <Brand /> hỗ trợ dịch vụ cho thuê online
          và <strong>giao hàng nhanh chóng trên phạm vi toàn quốc</strong>. Dù
          bạn ở gần hay xa, chỉ cần chọn mẫu, <Brand /> sẽ gửi những bộ cánh
          lung linh nhất đến tận tay bạn.
        </p>

        <SectionHeading>Giờ Mở Cửa</SectionHeading>
        <p>
          Để phục vụ bạn một cách chu đáo nhất, cửa hàng mở cửa đón khách ghé
          thử đồ trực tiếp vào tất cả các ngày trong tuần.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Giờ mở cửa:{' '}
            {/* nowrap: giữ nguyên cụm giờ, tránh bị tách kiểu "…(Thứ 2 –" / "Chủ nhật)" */}
            <strong className="whitespace-nowrap text-ink">
              {siteConfig.openingHours.text}
            </strong>
          </li>
        </ul>

        <SectionHeading>Liên Hệ &amp; Đặt Đồ</SectionHeading>
        <p>
          Quy trình thuê đồ cực kỳ nhanh gọn: bạn chỉ cần lướt xem mẫu, chọn
          bộ cánh ưng ý và nhắn ngay cho <Brand /> để giữ lịch. Hãy
          kết nối với chúng tôi qua các kênh dưới đây để được tư vấn size và
          chốt ngày diện đồ nhanh nhất:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Hotline/Zalo:{' '}
            <a
              href={siteConfig.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent-dark underline underline-offset-4"
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
              className="text-accent-dark underline underline-offset-4"
            >
              <Brand /> - Cho Thuê Váy&nbsp;Thiết&nbsp;Kế
            </a>
          </li>
          <li>
            Instagram:{' '}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-dark underline underline-offset-4"
            >
              @sherent.thuevaythietke
            </a>
          </li>
          <li>
            TikTok:{' '}
            <a
              href={siteConfig.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-dark underline underline-offset-4"
            >
              @sherent.chothuevay
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-10 max-w-2xl rounded-3xl border border-hairline bg-surface p-6">
        <h2 className="font-serif text-2xl text-accent-dark">Liên hệ giữ mẫu</h2>
        <p className="mt-2 text-sm text-muted">
          Nhắn Zalo hoặc gọi trực tiếp — <Brand /> sẽ phản hồi nhanh nhất có
          thể.
        </p>
        <ContactButtons className="mt-4" />
      </div>
    </article>
  );
}
