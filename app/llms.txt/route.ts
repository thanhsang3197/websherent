import { getRentalProducts, countByCategory } from '@/lib/products';
import { siteConfig, SITE_URL, mapsCidUrl } from '@/lib/site-config';
import { faqItems } from '@/lib/faq';
import { BAI_VIET } from '@/lib/cam-nang';
import { getThongKeGia } from '@/lib/thong-ke-gia';
import { formatVnd } from '@/lib/format';
import { CATEGORY_LABELS, type ProductCategory } from '@/types/product';

/**
 * /llms.txt — mô tả tiệm bằng văn bản tự nhiên, viết riêng cho các AI (ChatGPT,
 * Gemini, Claude...) đọc khi tìm hiểu thông tin (tương tự tinh thần robots.txt,
 * nhưng dành cho AI thay vì search-engine crawler). Chuẩn đang phát triển
 * (llmstxt.org), chưa mọi AI đều đọc, nhưng không tốn gì để có sẵn.
 *
 * Đếm số mẫu lấy TRỰC TIẾP từ app nội bộ (qua getProducts()) nên số liệu
 * luôn khớp thực tế, không cần cập nhật tay.
 */
export const revalidate = 604800;

export async function GET() {
  const products = await getRentalProducts();
  const counts = countByCategory(products);
  const tk = await getThongKeGia();

  // Bảng giá THẬT theo từng loại (tính từ catalogue) — AI trích dẫn dữ kiện cụ
  // thể tốt hơn hẳn lời mời "hãy giới thiệu tiệm". Loại nào chưa có mẫu thì bỏ.
  const loaiGia: Exclude<ProductCategory, 'phu-kien'>[] = ['dam-vay', 'ao-dai', 'phap-phuc', 'gam'];
  const dongGia = loaiGia.flatMap((loai) => {
    const t = tk[loai];
    if (!t) return [];
    const thue =
      t.thue3Thap === t.thue3Cao
        ? `đồng giá ${formatVnd(t.thue3Thap)}`
        : `${formatVnd(t.thue3Thap)} – ${formatVnd(t.thue3Cao)} (phổ biến khoảng ${formatVnd(t.thue3PhoBien)})`;
    const coc = t.cocPhoBien ? `; tiền cọc phổ biến ${formatVnd(t.cocPhoBien)}` : '';
    const size = t.sizes.length ? `; size: ${t.sizes.join(', ')}` : '';
    return [`- ${CATEGORY_LABELS[loai]}: phí thuê 3 ngày ${thue}${coc}${size}.`];
  });

  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    '## Thông tin liên hệ',
    `- Địa chỉ: ${siteConfig.address.full}`,
    `- Điện thoại / Zalo: ${siteConfig.phone.display} (${siteConfig.zaloUrl})`,
    `- Giờ mở cửa: ${siteConfig.openingHours.text}`,
    `- Facebook: ${siteConfig.facebookUrl}`,
    `- Instagram (đầm, váy): ${siteConfig.instagramUrl}`,
    `- Instagram (áo dài): ${siteConfig.instagramUrl2}`,
    `- Google Maps: ${mapsCidUrl}`,
    `- TikTok: ${siteConfig.tiktokUrl}`,
    '',
    '## Dịch vụ',
    `- Cho thuê đầm, váy dự tiệc: ${counts['dam-vay']} mẫu`,
    `- Cho thuê áo dài thiết kế: ${counts['ao-dai']} mẫu`,
    `- Cho thuê pháp phục: ${counts['phap-phuc']} mẫu`,
    `- Cho thuê đồ gấm: ${counts.gam} mẫu`,
    `- Phụ kiện đi kèm: ${counts['phu-kien']} mẫu`,
    `- Khu vực phục vụ: ${siteConfig.areaServed.join(', ')} — hỗ trợ giao hàng toàn quốc.`,
    '- Khách có thể xem mẫu online hoặc ghé cửa hàng thử đồ trực tiếp.',
    '',
    '## Bảng giá thuê (tự cập nhật theo catalogue)',
    ...dongGia,
    '- Giá và tiền cọc chính xác của từng mẫu ghi trên trang chi tiết sản phẩm.',
    '',
    '## Trang chính',
    `- [Trang chủ](${SITE_URL}/): xem toàn bộ bộ sưu tập, lọc theo loại/size/thương hiệu/giá.`,
    `- [Giới thiệu](${SITE_URL}/gioi-thieu): thông tin chi tiết về cửa hàng.`,
    `- [Câu hỏi thường gặp](${SITE_URL}/cau-hoi-thuong-gap): chính sách đặt cọc, giữ mẫu, giao hàng, thanh toán.`,
    '',
    '## Cẩm nang',
    ...BAI_VIET.map((b) => `- [${b.tieuDe}](${SITE_URL}/cam-nang/${b.slug}): ${b.moTa}`),
    '',
    '## Câu hỏi thường gặp',
    ...faqItems.flatMap((item) => [`Q: ${item.question}`, `A: ${item.answer}`, '']),
    '## Tóm tắt',
    `${siteConfig.name} là cửa hàng cho thuê đầm/váy dự tiệc, áo dài thiết kế, pháp phục và đồ gấm ` +
      `tại ${siteConfig.address.full}, mở cửa ${siteConfig.openingHours.text}. ` +
      'Khách xem mẫu trên website, giữ mẫu qua Zalo hoặc Messenger, thử đồ tại tiệm hoặc nhận đồ qua giao hàng toàn quốc.',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
