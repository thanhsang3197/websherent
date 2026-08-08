import Image from 'next/image';
import Link from 'next/link';
import { promoBanner } from '@/lib/site-config';

/**
 * Banner quảng cáo ở trang chủ — thay thế đoạn "Về SHERENT" khi được bật.
 * Nội dung sửa tại lib/site-config.ts (promoBanner). Tắt -> component trả null.
 *
 * Hỗ trợ: chỉ ảnh / chỉ chữ / cả hai. Mobile-first.
 */
export function PromoBanner() {
  const b = promoBanner;
  if (!b.enabled) return null;

  const hasText = Boolean(b.title || b.description);
  const hasCta = Boolean(b.ctaText && b.ctaHref);
  const isExternal = /^https?:\/\//i.test(b.ctaHref);

  // Bấm vào ảnh cũng đi tới cùng đích với nút (nếu có).
  const imageBlock = b.image ? (
    <Image
      src={b.image}
      alt={b.imageAlt}
      width={1600}
      height={900}
      sizes="(max-width: 1024px) 100vw, 1152px"
      className="h-auto w-full"
      priority
    />
  ) : null;

  return (
    <section
      aria-label="Khuyến mãi"
      className="container-content py-10 sm:py-14"
    >
      <div className="overflow-hidden rounded-3xl border border-hairline bg-surface">
        {imageBlock &&
          (hasCta ? (
            <CtaWrapper href={b.ctaHref} external={isExternal} className="block">
              {imageBlock}
            </CtaWrapper>
          ) : (
            imageBlock
          ))}

        {(hasText || hasCta) && (
          <div className="p-5 text-center sm:p-8">
            {b.title && (
              <h2 className="font-serif text-2xl text-accent-dark sm:text-3xl">
                {b.title}
              </h2>
            )}
            {b.description && (
              <p className="mx-auto mt-2 max-w-xl leading-relaxed text-muted">
                {b.description}
              </p>
            )}
            {hasCta && (
              <CtaWrapper
                href={b.ctaHref}
                external={isExternal}
                className="btn btn-primary mt-5"
              >
                {b.ctaText}
              </CtaWrapper>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** Link nội bộ dùng next/link; link ngoài mở tab mới an toàn. */
function CtaWrapper({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
