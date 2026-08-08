import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { faqJsonLd, breadcrumbJsonLd } from '@/lib/schema';
import { faqItems } from '@/lib/faq';
import { JsonLd } from '@/components/JsonLd';
import { ContactButtons } from '@/components/ContactButtons';

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp',
  description: `Giải đáp các câu hỏi thường gặp khi thuê đồ tại ${siteConfig.name}: đặt cọc, thời gian thuê, cách giữ mẫu, giao hàng, thanh toán...`,
  alternates: { canonical: '/cau-hoi-thuong-gap' },
};

export default function FaqPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: 'Câu hỏi thường gặp', url: `${SITE_URL}/cau-hoi-thuong-gap` },
  ]);

  return (
    <article className="container-content py-14">
      <JsonLd data={faqJsonLd(faqItems)} id="ld-faq" />
      <JsonLd data={breadcrumb} id="ld-breadcrumb-faq" />

      {/* Breadcrumb hiển thị */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">Câu hỏi thường gặp</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-accent-dark sm:text-5xl">
          Câu hỏi thường gặp
        </h1>
        <div className="rule-accent mt-5" />
        <p className="mt-4 text-muted">
          Chưa tìm thấy câu trả lời bạn cần? Nhắn Zalo cho {siteConfig.name}, tiệm
          phản hồi nhanh nhất có thể.
        </p>
      </header>

      {/*
        <details>/<summary> gốc HTML — không cần JS, đóng/mở được ngay, và Google
        vẫn đọc được toàn bộ nội dung kể cả khi đang thu gọn (tốt cho SEO/GEO).
      */}
      <div className="mt-8 max-w-2xl divide-y divide-hairline border-y border-hairline">
        {faqItems.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-ink marker:content-none">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-xl text-accent-dark transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 max-w-2xl rounded-3xl border border-hairline bg-surface p-6">
        <h2 className="font-serif text-2xl text-accent-dark">Còn thắc mắc khác?</h2>
        <p className="mt-2 text-sm text-muted">
          Nhắn Zalo hoặc gọi trực tiếp — {siteConfig.name} sẽ phản hồi nhanh nhất
          có thể.
        </p>
        <ContactButtons className="mt-4" />
      </div>
    </article>
  );
}
