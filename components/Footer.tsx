import Link from 'next/link';
import { siteConfig, mapsDirectionsUrl } from '@/lib/site-config';
import { Brand } from '@/components/Brand';

/**
 * Footer — hiển thị thông tin liên hệ dạng text (tốt cho SEO & GEO).
 *
 * Bố cục 3 cột theo mẫu chủ shop gửi 16/08/2026:
 *   1. Về SHERENT       — mô tả tiệm + liên hệ kèm icon
 *   2. Hỗ trợ khách hàng — giờ mở cửa, khu vực phục vụ
 *   3. Liên kết          — danh sách trang, dạng gạch đầu dòng
 *
 * Mẫu gốc còn 2 khối "Phương thức thanh toán" và "Phương thức vận chuyển" bằng
 * logo hãng — chủ shop chốt BỎ, nên không đưa vào (cũng tránh dùng logo thương
 * hiệu bên thứ ba mà tiệm không có quyền).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/60 bg-surface/75 backdrop-blur-xl">
      <div className="container-content grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {/* Cột 1 — Về tiệm + liên hệ */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-accent-dark">
            Về <Brand />
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            <Brand /> là tiệm cho thuê váy, đầm dự tiệc thiết kế, áo dài &amp;
            pháp phục tại {siteConfig.address.district}, {siteConfig.address.city}.
          </p>

          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li className="flex gap-2.5">
              <PinIcon />
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {siteConfig.address.full}
              </a>
            </li>
            <li className="flex gap-2.5">
              <PhoneIcon />
              <span>
                <a
                  href={`tel:${siteConfig.phone.tel}`}
                  className="transition-colors hover:text-accent"
                >
                  {siteConfig.phone.display}
                </a>
                {' · '}
                <a
                  href={`tel:${siteConfig.phone2.tel}`}
                  className="transition-colors hover:text-accent"
                >
                  {siteConfig.phone2.display}
                </a>{' '}
                ({siteConfig.phone2.hours})
              </span>
            </li>
            <li className="flex gap-2.5">
              <ChatIcon />
              <span>
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
              </span>
            </li>
          </ul>
        </div>

        {/* Cột 2 — Hỗ trợ khách hàng */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-accent-dark">
            Hỗ trợ khách hàng
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-2.5">
              <ClockIcon />
              <span>Giờ mở cửa: {siteConfig.openingHours.text}</span>
            </li>
            <li className="flex gap-2.5">
              <MapIcon />
              <span>
                Khu vực phục vụ: {siteConfig.areaServed.join(' · ')}
              </span>
            </li>
          </ul>
        </div>

        {/* Cột 3 — Liên kết */}
        <div>
          <h2 className="font-serif text-lg font-semibold text-accent-dark">
            Liên kết
          </h2>
          <nav aria-label="Chân trang">
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm marker:text-accent">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
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

/* --------------------------------------------------------------------------
 * Icon — vẽ thẳng bằng SVG (cùng kiểu với StickyContactBar: viewBox 24,
 * stroke currentColor) để không kéo thêm thư viện icon.
 * `shrink-0` giữ icon không bị bóp khi chữ xuống dòng.
 * -------------------------------------------------------------------------- */

const iconClass = 'mt-0.5 shrink-0 text-accent';

function PinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.2-.9L3 20.5l1.6-4.4A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M9 3 3 5.6v15L9 18l6 3 6-2.6v-15L15 6 9 3Z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}
