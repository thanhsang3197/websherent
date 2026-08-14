/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Ảnh sản phẩm gần như không đổi sau khi upload, nhưng nguồn ảnh lại gắn
    // Cache-Control rất ngắn (GitHub raw: 5 phút, Supabase: 1 giờ). Next mặc
    // định nghe theo nguồn, nên hết hạn là phải tải + nén lại từ đầu, mỗi tấm
    // tốn 500-800ms và khách phải chờ.
    //
    // Ghim sàn 7 NGÀY. Không để lâu hơn vì ~120 ảnh cũ trên GitHub đặt tên cố
    // định (vd PP02_tu_anh.jpg): nếu thay ảnh mới mà giữ nguyên tên file thì
    // URL không đổi, khách sẽ thấy ảnh cũ cho tới khi hết cache. Ảnh do WebApp
    // nội bộ upload lên Supabase có timestamp trong tên nên không dính lỗi này.
    // Muốn thay ảnh thấy ngay: đổi tên file (hoặc dùng WebApp nội bộ).
    minimumCacheTTL: 604_800,
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
