import { siteConfig } from '@/lib/site-config';
import { HeroCarousel } from '@/components/HeroCarousel';
import type { HeroSlide } from '@/types/hero';

/**
 * Hero — điểm nhấn thị giác chính: khung ảnh chữ nhật + tiêu đề serif.
 * `slides` là danh sách slide chạy slideshow (tự đổi mỗi 5s) — gồm cả mẫu lẫn
 * ảnh tự do shop treo bên app. Rỗng -> khung monogram.
 */
export function Hero({ slides = [] }: { slides?: HeroSlide[] }) {
  return (
    <section className="relative overflow-hidden py-10 lg:py-16">
      <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Nội dung */}
        <div className="order-2 lg:order-1">
          <p className="whitespace-nowrap text-center text-[clamp(10px,2.9vw,12px)] font-semibold uppercase tracking-[0.14em] text-accent-dark sm:text-left sm:text-sm sm:tracking-[0.2em]">
            Cho thuê váy · Đầm · Áo dài · Pháp phục
          </p>
          {/*
            Điện thoại: mỗi dòng slogan một khối, căn giữa; cỡ chữ theo bề rộng
            máy để dòng dài nhất ("bạn thuê một diện mạo" ≈ 10,45em) luôn vừa
            bề rộng nội dung (100vw − 40px lề) mà vẫn to nhất có thể. Đo thật:
            375px -> 31px, 320px -> 26px, 414px -> 34,6px.
          */}
          <h1 className="mt-4 text-center font-serif text-[clamp(1.5rem,calc((100vw-40px)/10.8),2.25rem)] leading-tight text-accent-dark sm:text-left sm:text-5xl lg:text-6xl">
            {siteConfig.sloganLines.map((line, i) => (
              <span key={i} className="block sm:inline">
                {i > 0 && ' '}
                {line}
              </span>
            ))}
          </h1>
          {/* Bảng số mẫu (268+ mẫu để chọn, mẫu tiệc, áo dài, pháp phục) đã bỏ
              theo yêu cầu chủ shop 17/09/2026. */}
        </div>

        {/*
          Ảnh signature — slideshow.

          KHUNG CHỮ NHẬT, không dùng `.arch` như trang chi tiết sản phẩm: vòm
          cắt mất hai góc TRÊN của ảnh, mà ở hero đó thường là chỗ có mặt mẫu
          hoặc chữ trên banner shop treo (ảnh tự do, api-cong-khai.md §2.3).
          Trang chi tiết vẫn giữ vòm — ở đó ảnh đã được chọn khuôn cho vừa.
        */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            {/* Quầng sáng thuỷ tinh phía sau */}
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full rounded-2xl border border-white/80 bg-white/30 backdrop-blur-md shadow-glass-glow"
            />
            <div className="relative aspect-[3/4] w-64 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/60 sm:w-72 lg:w-96">
              <HeroCarousel slides={slides} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
