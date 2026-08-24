/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // ─── Ghìm số "image transformation" của Vercel ─────────────────────────
    // Hobby chỉ cho 5.000 lượt gia công ảnh mỗi chu kỳ. Công thức tiêu thụ:
    //     số ảnh × số cỡ trong srcset × số định dạng (WebP + JPEG)
    // Danh sách mặc định của Next (8 deviceSizes + 8 imageSizes) gộp lại thành
    // 10 cỡ cho mỗi ô sản phẩm. Với 301 ảnh trong catalog:
    //     301 × 10 × 2 ≈ 6.020 lượt  ->  VƯỢT TRẦN (đã xảy ra 08/2026, ảnh
    //     trả 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED và hiện trắng).
    // Rút còn 4 cỡ: 301 × 4 × 2 ≈ 2.400 lượt, nằm gọn trong hạn mức.
    //
    // KHÔNG mất chất lượng: ảnh gốc rộng nhất trong kho chỉ 1392px, mà Next
    // không bao giờ phóng to ảnh — nên 2048/3840 chưa từng tạo ra thứ gì lớn
    // hơn ảnh gốc, chỉ tốn quota.
    //   96   -> thumbnail 48px trong ProductGallery (màn Retina)
    //   384  -> ô lưới trên điện thoại (50vw)
    //   640  -> ô lưới trên desktop (25vw, Retina) + ảnh chi tiết
    //   1080 -> ảnh chi tiết sản phẩm
    //   1920 -> Lightbox (100vw) và PromoBanner; thực tế trả về đúng cỡ gốc
    deviceSizes: [640, 1080, 1920],
    imageSizes: [96, 384],

    // ─── Cache ảnh đã gia công ─────────────────────────────────────────────
    // Nguồn ảnh gắn Cache-Control rất ngắn (GitHub raw: 5 phút, Supabase: 1
    // giờ). Next mặc định nghe theo nguồn, nên hết hạn là phải tải + nén lại
    // từ đầu — vừa chậm (500-800ms/tấm) vừa tính thêm 1 lượt transformation.
    //
    // Ghim sàn 31 NGÀY (~1 chu kỳ) để mỗi cỡ ảnh chỉ gia công lại 1 lần/tháng
    // thay vì 4 lần như khi để 7 ngày.
    //
    // Cache khoá theo URL, nên việc này KHÔNG cản trở cập nhật ảnh:
    //   - Ảnh up qua WebApp nội bộ (Sherent-app) luôn có timestamp trong tên
    //     -> URL mới -> khách thấy ngay. Cả 187 ảnh Supabase hiện tại đều vậy.
    //   - Rủi ro chỉ nằm ở 114 ảnh cũ trên GitHub đặt tên cố định (vd
    //     PP02_tu_anh.jpg): up đè cùng tên thì URL không đổi, khách sẽ thấy
    //     ảnh cũ cho tới 31 ngày.
    // Chữa cháy khi lỡ up đè: thêm query vào URL ảnh trong Sheet, vd
    //     .../PP02_tu_anh.jpg?v=2
    // URL đổi -> Vercel coi là ảnh mới -> tải lại tức thì.
    //
    // Lưu ý: /api/lam-moi (revalidateTag) chỉ xoá cache DỮ LIỆU sản phẩm,
    // không đụng tới cache ảnh. Deploy lại cũng không xoá cache ảnh.
    minimumCacheTTL: 2_678_400,
    // Ảnh sản phẩm hiện host trên GitHub repo của tiệm (sherent-hinhanh).
    // Ta chuẩn hoá URL về CDN raw.githubusercontent.com trong lib/format.ts,
    // nhưng vẫn cho phép cả github.com để an toàn nếu Sheet còn URL dạng /blob.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      // Ảnh chụp từ AppSheet -> lưu Google Drive -> script biến thành link công khai.
      // Cho phép các host Google phục vụ ảnh Drive (xem docs/dong-bo-anh-appsheet.md).
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // Ảnh do WebApp nội bộ (Sherent-app) upload lên Supabase Storage.
      // Thiếu mục này thì next/image ném lỗi "Invalid src prop" và CẢ TRANG trả
      // 500 — chỉ cần một mẫu dùng link Supabase là trang chủ sập, chứ không
      // phải chỉ thiếu mỗi tấm ảnh đó.
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
