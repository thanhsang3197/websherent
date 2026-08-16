/**
 * ⚙️ THÔNG TIN TIỆM — CHỖ SỬA DUY NHẤT.
 * Chủ tiệm chỉnh mọi thông tin liên hệ / địa chỉ / giờ mở cửa tại đây.
 * Các chỗ đánh dấu TODO là placeholder cần điền/khớp lại sau.
 */

/** URL công khai của site (dùng cho canonical, sitemap, Open Graph). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

const PHONE_RAW = '0982476969';
const PHONE_2_RAW = '0369180625';
const PHONE_3_RAW = '0777025776';

export const siteConfig = {
  name: 'Sherent',
  legalName: 'Sherent — Cho thuê đầm, váy & áo dài',

  /** Câu slogan ngắn (hero, header). */
  slogan: 'Chiếc đầm ưng ý cho mọi dịp đặc biệt',

  /**
   * Mô tả dài, văn phong tự nhiên — dùng cho meta description & GEO (để AI hiểu tiệm).
   */
  description:
    'Sherent là tiệm cho thuê đầm, váy dự tiệc và áo dài thiết kế tại Hóc Môn, TP.HCM. ' +
    'Nhiều mẫu đa dạng size, phí thuê hợp lý, phù hợp đi tiệc, chụp ảnh, dự sự kiện, ' +
    'cưới hỏi và Tết. Xem mẫu online và giữ mẫu nhanh qua Zalo.',

  /** Liên hệ. */
  phone: {
    /** Hiển thị đẹp. */
    display: '0982 476 969',
    /** Dạng bấm gọi (tel:). */
    tel: `+84${PHONE_RAW.slice(1)}`,
    /** Số gốc. */
    raw: PHONE_RAW,
  },
  /** Zalo dùng chung số điện thoại. */
  zaloUrl: `https://zalo.me/${PHONE_RAW}`,
  /** Số điện thoại/Zalo thứ hai — chỉ hiện ở Footer, cùng khung giờ hoạt động 15:00–20:30. */
  phone2: {
    display: '0369 180 625',
    tel: `+84${PHONE_2_RAW.slice(1)}`,
    hours: '15:00 – 20:30',
  },
  zaloUrl2: `https://zalo.me/${PHONE_2_RAW}`,
  /** Số điện thoại/Zalo thứ ba — chỉ dùng cho nút Zalo ở trang Thanh lý. */
  phone3: {
    display: '0777 025 776',
    tel: `+84${PHONE_3_RAW.slice(1)}`,
  },
  zaloUrl3: `https://zalo.me/${PHONE_3_RAW}`,
  facebookUrl: 'https://www.facebook.com/profile.php?id=61550268010962',
  /** Instagram chính — mảng váy/đầm thiết kế. */
  instagramUrl: 'https://www.instagram.com/sherent.thuevaythietke/',
  /** Instagram thứ hai — tiệm tách riêng mảng áo dài. */
  instagramUrl2: 'https://www.instagram.com/sherent.thueaodai/',
  tiktokUrl: 'https://www.tiktok.com/@sherent.chothuevay',

  /** Địa chỉ tiệm. */
  address: {
    street: '37/4A Lý Thường Kiệt',
    district: 'Hóc Môn',
    city: 'TP.HCM',
    region: 'TP. Hồ Chí Minh',
    country: 'VN',
    /** Chuỗi địa chỉ đầy đủ để hiển thị. */
    full: '37/4A Lý Thường Kiệt, Hóc Môn, TP.HCM',
  },

  /**
   * Toạ độ để nhúng bản đồ / schema geo.
   * // TODO(bản đồ): điền lat/lng thật của tiệm (lấy từ Google Maps). Để null thì bỏ qua geo.
   */
  geo: null as { lat: number; lng: number } | null,

  /** Khu vực phục vụ (dùng cho nội dung + schema areaServed). */
  areaServed: ['Hóc Môn', 'TP.HCM'],

  /** Giờ mở cửa đón khách thử đồ trực tiếp tại cửa hàng. */
  openingHours: {
    /** Hiển thị cho khách. */
    text: '15:00 – 20:30 (Thứ 2 – Chủ nhật)',
    /** Cho JSON-LD LocalBusiness. */
    opens: '15:00',
    closes: '20:30',
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },

  /** Khoảng giá cho schema LocalBusiness. */
  priceRange: '80.000₫ – 300.000₫',

  /**
   * Ảnh Open Graph / mạng xã hội mặc định.
   * Hiện dùng 1 ảnh mẫu đẹp có sẵn (JSON-LD & khi chia sẻ link sẽ hiện ảnh này).
   * // TODO(ảnh OG): nếu muốn, thay bằng ảnh thương hiệu 1200×630 rồi đặt trong /public.
   */
  ogImage:
    'https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg',

  /** Điều hướng chính. */
  nav: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/#san-pham' },
    { label: 'Thanh lý', href: '/thanh-ly' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Hỏi đáp', href: '/cau-hoi-thuong-gap' },
  ],
} as const;

/**
 * 🖼️ ẢNH KHUNG HERO (slideshow ở đầu trang chủ).
 *
 * CÁCH DÙNG: điền MÃ SP vào `productIds` theo ĐÚNG THỨ TỰ muốn hiện.
 *   vd: productIds: ['T161', 'T027', 'T037']
 * Mẫu phải có ảnh trong Sheet thì mới hiện được.
 *
 * Để mảng RỖNG [] -> web tự động lấy mẫu của `fallbackBrand` có ảnh (giá cao trước),
 * đúng như đang chạy hiện tại. Nhờ vậy hero không bao giờ bị trống.
 */
export const heroConfig = {
  /** TODO(hero): điền mã SP muốn ghim, vd ['T161','T027']. Rỗng = tự động. */
  productIds: [] as string[],
  /** Brand dùng khi productIds rỗng. */
  fallbackBrand: 'Sò Vintage',
  /** Số ảnh tối đa chạy trong slideshow. */
  maxSlides: 8,
};

/**
 * 🖼️ BANNER QUẢNG CÁO (trang chủ).
 *
 * CÁCH DÙNG:
 *  - `enabled: false`  -> không hiện gì.
 *  - `enabled: true`   -> banner hiện ở ĐẦU trang chủ (ngay dưới khung ảnh hero).
 *
 * Từ 16/08/2026 banner KHÔNG còn thay thế đoạn "Về SHERENT" nữa: đoạn giới
 * thiệu đã dời xuống cuối trang để khách thấy sản phẩm sớm hơn, còn banner giữ
 * nguyên trên đầu vì là tin khuyến mãi thời vụ.
 *
 * Điền `image` và/hoặc `title`+`description` đều được (có ảnh không chữ, có chữ không ảnh,
 * hoặc cả hai). Ảnh upload lên repo GitHub `sherent-hinhanh` giống ảnh sản phẩm.
 * Ảnh nên làm tỉ lệ ngang ~16:9 (vd 1600×900px) để hiển thị đẹp trên cả điện thoại lẫn máy tính.
 */
export interface PromoBannerConfig {
  /** Bật/tắt banner. Tắt -> hiện lại đoạn "Về SHERENT". */
  enabled: boolean;
  /** Link ảnh banner. Để trống nếu chỉ dùng chữ. */
  image: string;
  /** Mô tả ảnh (cho SEO + trình đọc màn hình). Bắt buộc nếu có ảnh. */
  imageAlt: string;
  /** Tiêu đề chữ (tuỳ chọn). */
  title: string;
  /** Mô tả chữ (tuỳ chọn). */
  description: string;
  /** Chữ trên nút (tuỳ chọn). Để trống thì không hiện nút. */
  ctaText: string;
  /** Nút dẫn đi đâu: '#san-pham', '/gioi-thieu', hoặc link ngoài (Zalo/Facebook...). */
  ctaHref: string;
}

export const promoBanner: PromoBannerConfig = {
  // TODO(banner): khi có ảnh/nội dung khuyến mãi -> đổi thành true và điền bên dưới.
  // Ví dụ khi bật:
  //   enabled: true,
  //   image: 'https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/banner_tet.jpg',
  //   imageAlt: 'Ưu đãi áo dài Tết tại Sherent',
  //   title: 'Ưu đãi Tết 2026',
  //   description: 'Giảm 20% toàn bộ áo dài thiết kế khi thuê từ 3 ngày.',
  //   ctaText: 'Xem mẫu áo dài',
  //   ctaHref: '#san-pham',
  enabled: false,
  image: '',
  imageAlt: '',
  title: '',
  description: '',
  ctaText: '',
  ctaHref: '',
};

/** Link Google Maps chỉ đường theo địa chỉ (tạm dùng địa chỉ dạng text). */
export const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.name} ${siteConfig.address.full}`,
)}`;

export type SiteConfig = typeof siteConfig;
