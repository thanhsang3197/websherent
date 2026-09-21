import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

/**
 * Web App Manifest — phục vụ khách "Thêm vào màn hình chính".
 *
 * Shop gửi link mẫu qua Zalo hàng ngày, nhiều khách mở đi mở lại nhiều lần
 * trước khi chốt; có manifest thì cú "thêm vào màn hình chính" cho ra một icon
 * và cái tên đàng hoàng thay vì ảnh chụp trang kèm URL.
 *
 * KHÔNG phải PWA đầy đủ: không có service worker, không chạy offline. Chỉ là
 * phần khai báo để icon/tên/màu hiển thị đúng.
 *
 * Next tự sinh route /manifest.webmanifest VÀ tự chèn <link rel="manifest">
 * vào <head> khi có file này — không cần khai thêm trong `metadata`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Cho thuê đầm, váy & áo dài`,
    // Tên dưới icon trên màn hình chính: Android cắt sau ~12 ký tự nên để
    // trơ mỗi tên tiệm.
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    /** Nền màn hình chờ lúc mở app — đúng màu nền web (--bg trong globals.css). */
    background_color: '#FAF7F3',
    /** Trùng `viewport.themeColor` ở app/layout.tsx — đổi thì đổi cả hai. */
    theme_color: '#F6F1EA',
    lang: 'vi',
    categories: ['shopping', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      /*
        Android khoét icon theo khuôn của máy (tròn, vuông bo, giọt nước...) —
        bản này chữ S nhỏ hơn hẳn để nằm gọn trong vùng an toàn (80% ở giữa),
        không bị xén mất.
      */
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
