import { siteConfig } from '@/lib/site-config';

/**
 * Tên thương hiệu — LUÔN hiển thị IN HOA TOÀN BỘ ở mọi nơi xuất hiện trong nội dung.
 * Dùng thay cho {siteConfig.name} bất kỳ khi nào tên hiện ra trực tiếp cho khách xem
 * (không dùng cho metadata/aria-label — những chỗ đó giữ nguyên dạng thường cho SEO/a11y).
 */
export function Brand() {
  return <span className="uppercase">{siteConfig.name}</span>;
}
