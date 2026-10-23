import Link from 'next/link';
import { siteConfig, mapsDirectionsUrl } from '@/lib/site-config';
import { Brand } from '@/components/Brand';
import { TrackedContactLink } from '@/components/TrackedContactLink';
import { ACoSuKien } from '@/components/LinkCoSuKien';

/**
 * Footer — hiển thị thông tin liên hệ dạng text (tốt cho SEO & GEO).
 *
 * Thiết kế lại 23/10/2026 cho GỌN (chủ shop: đủ thông tin như cũ, giữ màu
 * nền, không thêm chữ SHERENT cỡ lớn). Từ 3 cột cao ~750px thành 4 cột thấp:
 *   1. Tên tiệm + mô tả + mạng xã hội
 *   2. Liên hệ        — địa chỉ, 2 số (gọi + Zalo), Zalo thanh lý
 *   3. Giờ mở cửa     — giờ, khu vực phục vụ
 *   4. Khám phá       — danh sách trang
 * Bỏ viền mảnh và hiệu ứng kính mờ: các mảng tách nhau bằng một bậc màu nền.
 *
 * Mẫu gốc 16/08/2026 còn 2 khối "Phương thức thanh toán" và "Phương thức vận
 * chuyển" bằng logo hãng — chủ shop chốt BỎ (cũng tránh dùng logo thương hiệu
 * bên thứ ba mà tiệm không có quyền).
 */
/**
 * Style DÙNG CHUNG cho mọi tiêu đề cột trong footer. Gom vào một chỗ để các
 * tiêu đề không bị lệch font/cỡ chữ mỗi lần thêm mục mới.
 */
const footerHeadingClass = 'font-serif text-base font-semibold text-accent-dark';

/** Link mạng xã hội: icon + chữ, không khung — 4 link nằm gọn một hàng. */
const linkMxh = 'inline-flex items-center gap-1.5 transition-colors hover:text-accent';

/** Một số điện thoại = một dòng: bấm số để gọi, bấm chip "Zalo" để nhắn. */
function DongSo({
  tel,
  so,
  ghiChu,
  zalo,
}: {
  tel: string;
  so: string;
  ghiChu: string;
  zalo: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <PhoneIcon />
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <TrackedContactLink
          href={`tel:${tel}`}
          kieu="goi"
          viTri="footer"
          className="font-medium transition-colors hover:text-accent"
        >
          {so}
        </TrackedContactLink>
        <span className="text-xs text-muted">{ghiChu}</span>
        <TrackedContactLink
          href={zalo}
          kieu="zalo"
          viTri="footer"
          className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent-dark transition-colors hover:bg-accent/20"
        >
          Zalo
        </TrackedContactLink>
      </span>
    </li>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 bg-surface sm:mt-20">
      <div className="container-content grid grid-cols-2 gap-x-6 gap-y-6 py-8 text-sm text-ink sm:py-12 md:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:gap-x-12">
        {/* Cột 1 — Tên tiệm, mô tả, mạng xã hội */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink">
            <Brand />
          </h2>
          <p className="mt-2 max-w-xs leading-relaxed">
            Cho thuê váy, đầm dự tiệc thiết kế, áo dài &amp; pháp phục tại{' '}
            {siteConfig.address.district}, {siteConfig.address.city}.
          </p>

          {/* Mạng xã hội. Tiệm có HAI Instagram (váy thiết kế / áo dài) nên
              phải kèm nhãn chữ — để trơ 2 icon Instagram giống hệt nhau thì
              khách không biết đâu là đâu. */}
          <h3 className="sr-only">Theo dõi tiệm</h3>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'footer', kenh: 'Instagram váy' }}
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Sherent — váy, đầm thiết kế"
                className={linkMxh}
              >
                <InstagramIcon />
                Váy thiết kế
              </ACoSuKien>
            </li>
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'footer', kenh: 'Instagram áo dài' }}
                href={siteConfig.instagramUrl2}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Sherent — áo dài"
                className={linkMxh}
              >
                <InstagramIcon />
                Áo dài
              </ACoSuKien>
            </li>
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'footer', kenh: 'Facebook' }}
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Sherent"
                className={linkMxh}
              >
                <FacebookIcon />
                Facebook
              </ACoSuKien>
            </li>
            <li>
              <ACoSuKien
                suKien={{ loai: 'mxh', viTri: 'footer', kenh: 'TikTok' }}
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Sherent"
                className={linkMxh}
              >
                <TiktokIcon />
                TikTok
              </ACoSuKien>
            </li>
          </ul>
        </div>

        {/*
          Cột 2 — Liên hệ. MỘT dòng mỗi số (chủ shop 15/10/2026): bấm số để
          gọi, bấm chip "Zalo" để nhắn — trước đây mỗi số in hai lần, rối mắt.
        */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
          <h2 className={footerHeadingClass}>Liên hệ</h2>
          <ul className="mt-3 space-y-2.5">
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
            <DongSo
              tel={siteConfig.phone.tel}
              so={siteConfig.phone.display}
              ghiChu="Hotline"
              zalo={siteConfig.zaloUrl}
            />
            <DongSo
              tel={siteConfig.phone2.tel}
              so={siteConfig.phone2.display}
              ghiChu={siteConfig.phone2.hours}
              zalo={siteConfig.zaloUrl2}
            />
            <li className="flex items-center gap-2.5">
              <ChatIcon />
              <span>
                Thanh lý:{' '}
                <TrackedContactLink
                  href={siteConfig.zaloUrl3}
                  kieu="zalo"
                  viTri="footer"
                  className="font-medium transition-colors hover:text-accent"
                >
                  Zalo {siteConfig.phone3.display}
                </TrackedContactLink>
              </span>
            </li>
          </ul>
        </div>

        {/* Cột 3 — Giờ mở cửa & khu vực */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1">
          <h2 className={footerHeadingClass}>Giờ mở cửa</h2>
          <ul className="mt-3 space-y-2.5">
            <li className="flex gap-2.5">
              <ClockIcon />
              <span className="lg:whitespace-nowrap">{siteConfig.openingHours.text}</span>
            </li>
            <li className="flex gap-2.5">
              <MapIcon />
              <span className="lg:whitespace-nowrap">Phục vụ: {siteConfig.areaServed.join(' · ')}</span>
            </li>
          </ul>
        </div>

        {/* Cột 4 — Liên kết */}
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <h2 className={footerHeadingClass}>Khám phá</h2>
          <nav aria-label="Chân trang">
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="bg-tint/40">
        <div className="container-content py-4 text-xs text-ink">
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

/* Icon mạng xã hội: dùng ngay trong link trỏ về chính trang của nền tảng đó.
   Instagram vẽ nét cho hợp bộ icon phía trên; Facebook/TikTok chỉ có dạng khối
   đặc nên để fill, cỡ 15px nên nhìn vẫn đồng bộ. */
const socialIconClass = 'shrink-0 text-accent';

function InstagramIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={socialIconClass}
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={socialIconClass}
      aria-hidden="true"
    >
      <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2C11.54 2 9.68 3.66 9.68 6.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.05.28-1.73 1.76-1.73Z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={socialIconClass}
      aria-hidden="true"
    >
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .78-5.06V9.69a5.74 5.74 0 0 0-.78-.05 5.74 5.74 0 1 0 5.74 5.74V9.4a7.35 7.35 0 0 0 4.29 1.37V7.68a4.28 4.28 0 0 1-3.29-1.86Z" />
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
