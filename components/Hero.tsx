import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { NutLienHe } from '@/components/LienHeSheet';
import type { Album } from '@/types/album';
import { TheoDoiTiem, type TheKenh } from '@/components/TheoDoiTiem';

/** Nền pastel xoay vòng cho các ô "Bạn đi dịp gì?". */
const NEN_DIP = ['bg-pink-100', 'bg-amber-100', 'bg-sky-100', 'bg-emerald-100', 'bg-violet-100', 'bg-orange-100'];

/**
 * Hero KHÔNG ẢNH LỚN (16/11/2026): chỉ còn slogan + 2 nút trên nền hồng
 * nhạt, ngay dưới là "Theo dõi tiệm" (thẻ kênh có ảnh mẫu) và "Bạn đi dịp gì?".
 * Ảnh trưng bày đã bỏ: thẻ kênh và bộ sưu tập ngay bên dưới đã đủ hình, bỏ ảnh
 * để bộ sưu tập lên cao. Muốn có lại ảnh: xem lịch sử git của file này
 * (HeroCarousel vẫn còn).
 */
export function Hero({
  albums = [],
  kenh = [],
}: {
  /** Thẻ "Theo dõi tiệm" (IG, TikTok, Facebook). Rỗng -> ẩn cả hàng. */
  kenh?: TheKenh[];
  /** Album = "dịp" (tốt nghiệp, đi tiệc…). Rỗng -> ẩn hàng "Bạn đi dịp gì?". */
  albums?: Album[];
}) {
  return (
    <section className="relative overflow-hidden pb-4 sm:pb-10">
      {/* Nền hồng nhạt loang + một vòm mờ góc phải — giữ chất thương hiệu mà không cần ảnh. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-accent/[0.09] to-transparent" />
      {/* Đẩy ra sát mép + nhạt hơn để không cắt ngang chữ; máy tính có thẻ kênh bên phải nên ẩn. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-24 -z-10 h-64 w-48 rounded-t-full border-[10px] border-accent/[0.06] sm:-right-10 sm:h-80 sm:w-60 lg:hidden"
      />

      {/* Máy tính: slogan bên trái, 4 thẻ "Theo dõi tiệm" 2×2 bên phải. Điện thoại: xếp dọc. */}
      <div className="container-content pt-6 sm:pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-center lg:gap-12 lg:pt-14">
        <div className="max-w-2xl">
          {/* SEO: H1 là dòng từ khoá (thuê gì + ở đâu); slogan là <p> nhưng giữ y style tiêu đề.
              font-sans/tracking ghi rõ để ghi đè style mặc định của h1 trong globals.css. */}
          <h1 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-accent-dark [text-wrap:balance]">
            {/* Khoảng trắng không ngắt trước "·" để dấu chấm giữa luôn đứng cuối dòng, không rơi ra đầu dòng mới. */}
            Cho thuê váy&nbsp;· Đầm&nbsp;· Áo dài&nbsp;· Pháp phục tại Hóc&nbsp;Môn
          </h1>
          <p className="mt-3 font-serif text-[clamp(1.75rem,8vw,2.4rem)] font-medium leading-[1.18] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.1rem]">
            {siteConfig.sloganLines.join(' ')}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Đầm dự tiệc, váy thiết kế, áo dài &amp; pháp phục cho thuê theo ngày. Cọc hoàn lại khi trả đồ.
          </p>

          <div className="mt-5 grid max-w-md grid-cols-2 gap-2.5">
            <Link href="/#san-pham" className="btn btn-primary !px-3 !py-3.5 text-[15px]">
              Xem mẫu váy
            </Link>
            <NutLienHe
              viTri="trang-chu"
              className="btn !px-3 !py-3.5 text-[15px] text-ink ring-[1.5px] ring-inset ring-ink transition-colors hover:bg-ink hover:text-white"
            >
              Nhắn tiệm
            </NutLienHe>
          </div>

          <ul className="mt-4 hidden flex-wrap gap-x-4 gap-y-1 text-sm text-muted sm:flex">
            <li>Mở {siteConfig.phone2.hours} mỗi ngày</li>
            <li>
              {siteConfig.address.district}, {siteConfig.address.city}
            </li>
          </ul>
        </div>

        <TheoDoiTiem the={kenh} canhHero />
      </div>

      {albums.length > 0 && (
        <div className="container-content mt-6 sm:mt-12">
          <h2 className="text-xl text-ink sm:text-2xl">Album theo dịp</h2>
          {/* Điện thoại: một hàng vuốt ngang (ô sau ló ra báo hiệu vuốt được) thay vì lưới 3 hàng. */}
          <ul className="-mx-5 mt-3 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden">
            {albums.slice(0, 6).map((a, i) => (
              <li key={a.slug} className="w-[40%] shrink-0 snap-start sm:w-auto">
                <Link
                  href={`/album/${a.slug}`}
                  className={`flex h-full min-h-14 items-center justify-center rounded-2xl px-3 py-2 text-center text-[13px] font-semibold leading-tight text-ink transition-transform hover:-translate-y-0.5 sm:min-h-16 sm:text-sm ${NEN_DIP[i % NEN_DIP.length]}`}
                >
                  {a.ten}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
