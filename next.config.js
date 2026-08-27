/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // ─── Ghìm số "image transformation" của Vercel ─────────────────────────
    // Hobby chỉ cho 5.000 lượt gia công ảnh mỗi chu kỳ. Công thức tiêu thụ:
    //     số ảnh × số cỡ trong srcset        (mỗi cỡ đúng 1 file WebP)
    // Danh sách mặc định của Next (8 deviceSizes + 8 imageSizes) gộp lại thành
    // 10 cỡ cho mỗi ô sản phẩm. Với ~284 ảnh trong catalog:
    //     284 × 10 ≈ 2.840 lượt cho MỘT vòng nén.
    // Con số đó vẫn dưới trần, nhưng cache ảnh hồi đó chỉ sống 7 ngày nên mỗi
    // cỡ bị nén lại ~4 lần trong 1 chu kỳ 30 ngày -> VƯỢT TRẦN (xảy ra 08/2026,
    // ảnh trả 402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED và hiện trắng).
    // Cách chữa gồm 2 vế: cắt số cỡ (ngay dưới) + kéo dài cache (mục kế tiếp).
    //
    // Rút còn 3 cỡ: 284 × 3 ≈ 850 lượt mỗi vòng.
    //   384  -> ô lưới sản phẩm trên desktop màn thường (25vw)
    //   640  -> ô lưới trên điện thoại Retina; ảnh gallery trên desktop
    //   1080 -> ô lưới trên desktop Retina; ảnh gallery trên điện thoại Retina
    //
    // ĐÃ GỠ 96 và 1920 (28/08/2026) cùng lúc với việc gỡ dải thumbnail và
    // lightbox trong ProductGallery — hai vị trí duy nhất còn cần tới chúng:
    //   96   -> thumbnail 48px (đã thay bằng dãy chấm + kéo ngang)
    //   1920 -> lightbox phóng to (đã gỡ hẳn)
    // Khảo sát 08/2026 cho thấy đây là hai cỡ tốn nhất mà ít người xem nhất:
    // 98% ảnh ở cỡ 96 và 78% ảnh ở cỡ 1920 đã cạn quota, trong khi 640 chỉ 3%.
    // Gỡ chúng KHÔNG đổi cỡ nào đang được tải thật, chỉ cắt bớt candidate thừa
    // trong srcset -> cache 384/640/1080 hiện có vẫn nguyên vẹn.
    //
    // Lưu ý nếu bật lại PromoBanner (lib/site-config.ts): banner rộng 1152px
    // giờ trần là 1080 thay vì 1920. Cần nét hơn thì thêm 1920 vào lại.
    //
    // KHÔNG mất chất lượng: ảnh gốc rộng nhất trong kho chỉ 1392px, mà Next
    // không bao giờ phóng to ảnh — nên 1920 chưa từng tạo ra thứ gì lớn hơn
    // ảnh gốc, chỉ tốn quota.
    deviceSizes: [640, 1080],
    imageSizes: [384],

    // ─── Định dạng đầu ra ──────────────────────────────────────────────────
    // Đúng 1 định dạng: WebP. Đây cũng là mặc định của Next 14, khai ra để
    // bản Next sau có đổi mặc định (vd thêm AVIF) cũng không tự nhân đôi số
    // lượt gia công.
    //
    // Next vẫn còn một nhánh trả về ĐỊNH DẠNG GỐC (JPEG) cho trình duyệt
    // không gửi `Accept: image/webp` — nhánh này không tắt được bằng config.
    // Kiểm tra 08/2026: suốt cả chu kỳ không có lấy một request nào rơi vào
    // nhánh đó, nên coi như mỗi cỡ = 1 lượt.
    formats: ['image/webp'],

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
