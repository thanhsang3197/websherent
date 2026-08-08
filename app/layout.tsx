import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { localBusinessJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyContactBar } from '@/components/StickyContactBar';

// Tiêu đề: serif thanh lịch. Body: Be Vietnam Pro (đủ dấu tiếng Việt).
const serif = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
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
  themeColor: '#F6F1EA',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body className="relative min-h-screen bg-bg text-ink selection:bg-accent/20">
        {/* Nền quầng sáng chuyển động hiệu ứng Liquid Glass */}
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-accent/25 to-amber-200/30 blur-[100px] animate-fluid-blob" />
          <div className="absolute -right-20 top-1/3 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-rose-300/20 to-accent/20 blur-[120px] animate-fluid-blob-slow" />
          <div className="absolute bottom-10 left-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-amber-300/20 to-accent/15 blur-[110px] animate-fluid-blob" />
        </div>

        {/* JSON-LD LocalBusiness — hiện trên mọi trang cho SEO & GEO. */}
        <JsonLd data={localBusinessJsonLd()} id="ld-localbusiness" />
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-surface"
        >
          Bỏ qua tới nội dung
        </a>
        <Header />
        <main id="noi-dung">{children}</main>
        <Footer />
        <StickyContactBar />
      </body>
    </html>
  );
}
