import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { HeroCarousel } from '@/components/HeroCarousel';
import { NutLienHe } from '@/components/LienHeSheet';
import type { HeroSlide } from '@/types/hero';
import type { Album } from '@/types/album';

/** Nền pastel xoay vòng cho các ô "Bạn đi dịp gì?". */
const NEN_DIP = ['bg-pink-100', 'bg-amber-100', 'bg-sky-100', 'bg-emerald-100', 'bg-violet-100', 'bg-orange-100'];

/**
 * Hero — PHƯƠNG ÁN A (chủ shop chọn 13/11/2026): ảnh mẫu lớn trong khung vòm
 * + slogan + 2 nút ("Xem mẫu váy", "Nhắn tiệm") + dòng tin cậy, ngay dưới là
 * "Bạn đi dịp gì?" dẫn vào các album shop dựng bên app.
 *
 * Khung vòm thoải (bo trên ~28% chiều cao) chứ không phải `.arch` gắt của thẻ
 * sản phẩm: ảnh tự do shop treo (banner có chữ) bị cắt góc ít hơn.
 */
export function Hero({
  slides = [],
  albums = [],
  soFeedback = 0,
}: {
  slides?: HeroSlide[];
  /** Album = "dịp" (tốt nghiệp, đi tiệc…). Rỗng -> ẩn hàng "Bạn đi dịp gì?". */
  albums?: Album[];
  /** Số ảnh khách thật — 0 thì không ghi. */
  soFeedback?: number;
}) {
  return (
    <section className="relative overflow-hidden pb-4 pt-3 sm:pb-10 sm:pt-8 lg:pt-12">
      <div className="container-content grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14">
        {/* Ảnh — điện thoại đứng trước */}
        <div className="lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden bg-tint shadow-glass-lg [border-radius:50%_50%_24px_24px/28%_28%_24px_24px]">
            <HeroCarousel slides={slides} />
          </div>
        </div>

        {/* Nội dung */}
        <div className="lg:order-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-dark [text-wrap:balance]">
            {/* Khoảng trắng không ngắt trước "·" để dấu chấm giữa luôn đứng cuối dòng, không rơi ra đầu dòng mới. */}
            Cho thuê váy&nbsp;· Đầm&nbsp;· Áo dài&nbsp;· Pháp phục
          </p>
          <h1 className="mt-3 text-[clamp(1.75rem,8vw,2.4rem)] leading-[1.18] text-ink sm:text-5xl lg:text-[3.4rem]">
            {siteConfig.sloganLines.join(' ')}
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
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

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted sm:text-sm">
            {soFeedback > 0 && (
              <li>
                <Link href="/feedback" className="hover:text-accent-dark">
                  <b className="text-ink">{soFeedback}+</b> ảnh khách thật
                </Link>
              </li>
            )}
            <li>Mở {siteConfig.phone2.hours} mỗi ngày</li>
            <li>
              {siteConfig.address.district}, {siteConfig.address.city}
            </li>
          </ul>
        </div>
      </div>

      {albums.length > 0 && (
        <div className="container-content mt-8 sm:mt-12">
          <h2 className="text-xl text-ink sm:text-2xl">Bạn đi dịp gì?</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {albums.slice(0, 6).map((a, i) => (
              <li key={a.slug}>
                <Link
                  href={`/album/${a.slug}`}
                  className={`flex min-h-14 items-center justify-center rounded-2xl px-3 py-2 text-center text-[13px] font-semibold leading-tight text-ink transition-transform hover:-translate-y-0.5 sm:min-h-16 sm:text-sm ${NEN_DIP[i % NEN_DIP.length]}`}
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
