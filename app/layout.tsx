import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { localBusinessJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PromoBar } from '@/components/PromoBar';
import { TheoDoiChepSo } from '@/components/TheoDoiChepSo';
import { Header } from '@/components/Header';
import { getAlbums, getUuDai } from '@/lib/products';
import { Footer } from '@/components/Footer';
import { ThanhDuoi } from '@/components/ThanhDuoi';
import { LienHeSheet } from '@/components/LienHeSheet';
import { ThongBao } from '@/components/ThongBao';

// Tiêu đề + logo: Playfair Display. Nội dung: Be Vietnam Pro (đủ dấu tiếng Việt).
const serif = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} — Cho thuê đầm, váy & áo dài tại ${siteConfig.address.district}, ${siteConfig.address.city}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'cho thuê đầm',
    'cho thuê váy',
    'thuê áo dài',
    'thuê đầm dự tiệc',
    'cho thuê đầm Hóc Môn',
    'thuê váy TP.HCM',
    'Sherent',
  ],
  authors: [{ name: siteConfig.name }],
  /*
    Favicon tab trình duyệt: SVG (app/icon.svg) — nét ở mọi cỡ, nhẹ.

    Icon màn hình chính iOS thì PHẢI là PNG: Safari không đọc SVG cho
    apple-touch-icon, thiếu file này máy tự chụp lại trang web làm icon. Ảnh
    sinh bằng `npm run generate:icons`, để full-bleed không bo góc vì iOS tự
    bo — mình bo sẵn thì bốn góc trong suốt sẽ thành viền đen.
  */
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Cho thuê đầm, váy & áo dài`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — cho thuê đầm, váy & áo dài`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Cho thuê đầm, váy & áo dài`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#FFF7F3',
  colorScheme: 'light',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mục "Album" trên menu chỉ hiện khi đang có album — cùng lượt gọi (đã cache)
  // với khối album trang chủ, nên không tốn thêm request.
  const coAlbum = (await getAlbums()).length > 0;

  // Thanh ưu đãi mỏng trên cùng mọi trang. Cùng lượt gọi (đã cache) với khối
  // "Ưu đãi" ở trang chủ; rỗng thì không vẽ gì.
  const thanhUuDai = (await getUuDai())
    .filter((u) => u.hienThanhTren)
    .map((u) => ({ id: u.id, loai: u.loai, tieuDe: u.tieuDe, loaiTen: u.loaiTen }));

  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body className="relative min-h-screen bg-bg pb-[calc(64px+env(safe-area-inset-bottom))] text-ink selection:bg-accent/20 md:pb-0">
        {/*
          Nền quầng sáng Liquid Glass. Điện thoại (13/11/2026): chỉ 1 quầng
          ĐỨNG YÊN — 3 khối blur 100px+ chạy liên tục làm giật khi cuộn trên máy
          tầm trung. Từ md trở lên giữ đủ 3 quầng chuyển động như cũ.
        */}
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-accent/12 to-amber-200/15 blur-[100px] md:animate-fluid-blob" />
          <div className="absolute -right-20 top-1/3 hidden h-[600px] w-[600px] rounded-full bg-gradient-to-br from-rose-300/10 to-accent/10 blur-[120px] md:block md:animate-fluid-blob-slow" />
          <div className="absolute bottom-10 left-1/4 hidden h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-amber-300/10 to-accent/8 blur-[110px] md:block md:animate-fluid-blob" />
        </div>

        {/* JSON-LD LocalBusiness — hiện trên mọi trang cho SEO & GEO. */}
        <JsonLd data={localBusinessJsonLd()} id="ld-localbusiness" />
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-surface"
        >
          Bỏ qua tới nội dung
        </a>
        {/* Thanh ưu đãi nằm ngay dưới Header, dính cùng Header khi cuộn để khách luôn thấy ưu đãi. */}
        <div className="sticky top-0 z-40">
          <Header coAlbum={coAlbum} />
          <PromoBar items={thanhUuDai} />
        </div>
        <main id="noi-dung">{children}</main>
        <Footer />
        {/* Điện thoại: thanh điều hướng dưới đáy (thay nút Zalo nổi cũ, 13/11/2026). */}
        <ThanhDuoi />
        <LienHeSheet />
        <ThongBao />
        <Analytics />
        <TheoDoiChepSo />
      </body>
    </html>
  );
}
