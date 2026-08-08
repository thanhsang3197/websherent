/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
    ],
  },
};

module.exports = nextConfig;
