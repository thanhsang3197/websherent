/**
 * Dữ liệu bài viết (blog xu hướng). Cấu trúc dạng "block" đơn giản (đoạn văn /
 * tiêu đề phụ / danh sách) — đủ để trình bày bài viết có bố cục rõ ràng mà
 * không cần cài thêm CMS/MDX. Thêm bài mới: thêm 1 phần tử vào mảng `blogPosts`.
 *
 * // TODO(nội dung): đây là bài viết mẫu để có sẵn hạ tầng blog hoạt động ngay.
 * // Muốn thêm bài mới hoặc chỉnh sửa nội dung, cứ nhờ mình — chỉ cần mô tả chủ đề.
 */

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  /** Mô tả ngắn — dùng ở thẻ danh sách + meta description. */
  excerpt: string;
  /** Định dạng YYYY-MM-DD. */
  publishedAt: string;
  /** Ảnh bìa (tuỳ chọn) — dùng link ảnh trên GitHub repo giống ảnh sản phẩm. */
  coverImage?: string;
  /**
   * Link video TikTok (tuỳ chọn) — dán nguyên link đầy đủ, cả link ngắn
   * (vm.tiktok.com/...) hay link dài (tiktok.com/@.../video/...) đều được.
   * Có link -> tự hiện video nhúng ngay đầu bài viết.
   */
  tiktokUrl?: string;
  blocks: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'cach-chon-dam-du-tiec-hop-dang-nguoi',
    title: 'Cách chọn đầm dự tiệc hợp dáng người',
    excerpt:
      'Chọn đúng dáng đầm giúp bạn tự tin hơn hẳn trong mọi bữa tiệc. Gợi ý nhanh theo từng dáng người và từng dịp cụ thể.',
    publishedAt: '2026-07-01',
    tiktokUrl:
      'https://www.tiktok.com/@sherent.chothuevay/video/7651854498255752464',
    blocks: [
      {
        type: 'paragraph',
        text:
          'Một chiếc đầm đẹp không chỉ nằm ở kiểu dáng hay chất liệu, mà quan trọng hơn ' +
          'là chọn đúng form dáng tôn lên vóc dáng của bạn. Dưới đây là vài gợi ý nhanh ' +
          'giúp bạn tự tin hơn khi chọn đầm dự tiệc.',
      },
      { type: 'heading', text: 'Chọn theo dáng người' },
      {
        type: 'list',
        items: [
          'Dáng quả lê (vai nhỏ, hông to): ưu tiên đầm chữ A hoặc xoè nhẹ từ eo, tay áo có chi tiết bèo/phồng nhẹ để cân đối phần vai.',
          'Dáng đồng hồ cát: hầu như kiểu nào cũng hợp — đầm ôm nhẹ theo form cơ thể sẽ tôn trọn đường cong tự nhiên.',
          'Dáng chữ nhật (vai và hông tương đồng): chọn đầm có điểm nhấn ở eo (dây thắt, phối màu) để tạo cảm giác có eo hơn.',
          'Dáng tam giác ngược (vai rộng hơn hông): đầm xoè từ hông, tay áo đơn giản, tránh chi tiết cầu vai to bản.',
        ],
      },
      { type: 'heading', text: 'Chọn theo dịp' },
      {
        type: 'paragraph',
        text:
          'Tiệc tối trang trọng hợp với đầm dáng dài, chất liệu ánh nhẹ (lụa, voan nhiều lớp), ' +
          'tông màu trầm hoặc ánh kim. Tiệc ban ngày, sinh nhật, họp mặt bạn bè thì đầm midi ' +
          'hoặc mini với tông màu tươi sáng sẽ phù hợp và thoải mái di chuyển hơn.',
      },
      { type: 'heading', text: 'Phối phụ kiện' },
      {
        type: 'paragraph',
        text:
          'Với đầm đã có nhiều chi tiết (ren, đính đá, bèo nhún), nên giữ phụ kiện tối giản ' +
          'để tránh rối mắt. Ngược lại, đầm trơn màu đơn sắc là nền tốt để bạn thoải mái ' +
          'phối thêm khuyên tai, vòng cổ hoặc túi cầm tay nổi bật.',
      },
      {
        type: 'paragraph',
        text:
          'Nếu chưa chắc dáng đầm nào hợp với mình, bạn cứ xem qua bộ sưu tập đầm & váy tại ' +
          'Sherent rồi nhắn Zalo — tiệm sẵn sàng tư vấn dáng phù hợp trước khi bạn giữ mẫu.',
      },
    ],
  },
  {
    slug: 'chon-ao-dai-ngay-tet-mau-sac-kieu-dang',
    title: 'Diện áo dài ngày Tết: chọn màu và kiểu dáng thế nào cho hợp?',
    excerpt:
      'Áo dài Tết không chỉ đẹp mà còn mang ý nghĩa may mắn qua từng gam màu. Tổng hợp gợi ý chọn màu và kiểu dáng theo dịp.',
    publishedAt: '2026-07-08',
    blocks: [
      {
        type: 'paragraph',
        text:
          'Ngày Tết là dịp áo dài được diện nhiều nhất trong năm — đi chúc Tết, chụp ảnh gia ' +
          'đình, đi chùa đầu năm. Chọn đúng màu sắc và kiểu dáng không chỉ đẹp mà còn gửi gắm ' +
          'mong ước may mắn cho năm mới.',
      },
      { type: 'heading', text: 'Ý nghĩa một số gam màu ngày Tết' },
      {
        type: 'list',
        items: [
          'Đỏ: màu may mắn, thịnh vượng — lựa chọn kinh điển không bao giờ lỗi thời.',
          'Vàng/vàng đồng: tượng trưng cho sự sung túc, phú quý, rất hợp diện đi chúc Tết họ hàng.',
          'Hồng phấn/hồng đào: nhẹ nhàng, trẻ trung, hợp với các bạn nữ trẻ hoặc chụp ảnh Tết.',
          'Xanh ngọc/xanh lá: mới mẻ, thanh lịch — lựa chọn khác biệt nếu bạn muốn tránh tông đỏ-vàng quen thuộc.',
        ],
      },
      { type: 'heading', text: 'Áo dài truyền thống hay cách tân?' },
      {
        type: 'paragraph',
        text:
          'Áo dài truyền thống (form ôm, cổ cao) phù hợp không khí trang trọng khi đi chúc Tết ' +
          'ông bà, cha mẹ. Áo dài cách tân (tay lỡ, phối váy xoè, hoạ tiết hiện đại) linh hoạt ' +
          'hơn cho các buổi chụp ảnh, dạo phố ngày Tết cùng bạn bè.',
      },
      { type: 'heading', text: 'Chọn theo từng dịp' },
      {
        type: 'paragraph',
        text:
          'Đi chùa đầu năm nên ưu tiên áo dài kín đáo, màu nhã nhặn. Chụp ảnh gia đình có thể ' +
          'chọn cả nhà cùng tông màu hoặc các sắc độ gần nhau để lên hình hài hoà. Dự tiệc tất ' +
          'niên công ty thì áo dài cách tân, màu nổi bật sẽ giúp bạn tự tin và nổi bật hơn.',
      },
      {
        type: 'paragraph',
        text:
          'Sherent có sẵn nhiều mẫu áo dài thiết kế đa dạng màu sắc và size cho mùa Tết. Xem ' +
          'trực tiếp trên website và nhắn Zalo để giữ mẫu sớm — mùa Tết thường hết mẫu đẹp khá nhanh.',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Danh sách bài viết, mới nhất trước. */
export function getSortedBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
