import Link from 'next/link';
import { siteConfig, mapsDirectionsUrl } from '@/lib/site-config';
import { Brand } from '@/components/Brand';

/**
 * Footer — hiển thị thông tin liên hệ dạng text (tốt cho SEO & GEO).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/60 bg-surface/75 backdrop-blur-xl">
      <div className="container-content grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-semibold text-accent-dark">
            <Brand />
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Cho thuê váy, đầm dự tiệc thiết kế, áo dài &amp; pháp phục.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-dark">
            Liên hệ
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {siteConfig.address.full}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="transition-colors hover:text-accent"
              >
                Điện thoại: {siteConfig.phone.display}
              </a>
              {' · '}
              <a
                href={`tel:${siteConfig.phone2.tel}`}
                className="transition-colors hover:text-accent"
              >
                {siteConfig.phone2.display}
              </a>{' '}
              ({siteConfig.phone2.hours})
            </li>
            <li>
              <a
                href={siteConfig.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                Zalo: {siteConfig.phone.display}
              </a>
              {' · '}
              <a
                href={siteConfig.zaloUrl2}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {siteConfig.phone2.display}
              </a>{' '}
              ({siteConfig.phone2.hours})
            </li>
            <li>Giờ mở cửa: {siteConfig.openingHours.text}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-dark">
            Khu vực phục vụ
          </h2>
          <p className="mt-4 text-sm text-muted">
            {siteConfig.areaServed.join(' · ')}
          </p>
          <nav className="mt-6 flex flex-col gap-2 text-sm" aria-label="Chân trang">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/60 bg-surface/50">
        <div className="container-content py-5 text-xs text-muted">
          © {year} <Brand />. Cho thuê đầm, váy &amp; áo dài —{' '}
          {siteConfig.address.district}, {siteConfig.address.city}.
        </div>
      </div>
    </footer>
  );
}
