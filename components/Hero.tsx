import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { HeroCarousel } from '@/components/HeroCarousel';
import type { ProductCategory } from '@/types/product';

/**
 * Hero — điểm nhấn thị giác chính: khung ảnh vòm (arch) + tiêu đề serif.
 * `images` là danh sách ảnh chạy slideshow (tự đổi mỗi 5s). Rỗng -> khung monogram.
 */
export function Hero({
  images = [],
  productCount,
  counts,
}: {
  images?: { url: string; alt: string }[];
  productCount?: number;
  /** Số mẫu theo từng loại — hiện dạng thống kê nhỏ bên dưới nút bấm. */
  counts?: Record<ProductCategory, number>;
}) {
  return (
    <section className="relative overflow-hidden py-10 lg:py-16">
      <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Nội dung */}
        <div className="order-2 lg:order-1">
          <p className="text-balance text-xs font-semibold uppercase tracking-[0.18em] text-accent-dark sm:text-sm sm:tracking-[0.2em]">
            Cho thuê váy · Đầm · Áo dài · Pháp phục
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-accent-dark sm:text-5xl lg:text-6xl">
            {siteConfig.slogan}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Tuyển chọn đầm, váy dự tiệc và áo dài thiết kế đa dạng size tại{' '}
            {siteConfig.address.district}, {siteConfig.address.city}. Xem mẫu
            thoải mái, chọn được rồi giữ mẫu nhanh qua Zalo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#san-pham" className="btn btn-primary">
              Xem bộ sưu tập
            </Link>
            <a
              href={siteConfig.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Nhắn Zalo
            </a>
          </div>

          {/* Stat panel Liquid Glass */}
          <dl className="mt-10 grid grid-cols-2 gap-4 rounded-3xl glass-card p-5 sm:grid-cols-5">
            <div className="text-center sm:text-left">
              <dt className="sr-only">Tổng số mẫu</dt>
              <dd className="font-serif text-2xl font-semibold text-accent-dark">
                {productCount ? `${productCount}+` : 'Nhiều'}
              </dd>
              <p className="text-xs text-muted">mẫu để chọn</p>
            </div>
            <div className="border-l border-white/60 pl-4 text-center sm:text-left">
              <dt className="sr-only">Số mẫu tiệc</dt>
              <dd className="font-serif text-2xl font-semibold text-accent-dark">{counts?.['dam-vay'] ?? 0}+</dd>
              <p className="text-xs text-muted">mẫu tiệc</p>
            </div>
            <div className="border-l border-white/60 pl-4 text-center sm:text-left">
              <dt className="sr-only">Số mẫu áo dài</dt>
              <dd className="font-serif text-2xl font-semibold text-accent-dark">{counts?.['ao-dai'] ?? 0}+</dd>
              <p className="text-xs text-muted">mẫu áo dài</p>
            </div>
            <div className="border-l border-white/60 pl-4 text-center sm:text-left">
              <dt className="sr-only">Số mẫu pháp phục</dt>
              <dd className="font-serif text-2xl font-semibold text-accent-dark">{counts?.['phap-phuc'] ?? 0}+</dd>
              <p className="text-xs text-muted">mẫu pháp phục</p>
            </div>
            {/* Gấm còn ít mẫu nên trên điện thoại (2 cột) cho ô này nằm trọn
                hàng cuối, tránh để trống nửa hàng trông như lỗi hiển thị. */}
            <div className="col-span-2 border-l border-white/60 pl-4 text-center sm:col-span-1 sm:text-left">
              <dt className="sr-only">Số mẫu gấm</dt>
              <dd className="font-serif text-2xl font-semibold text-accent-dark">{counts?.gam ?? 0}+</dd>
              <p className="text-xs text-muted">mẫu gấm</p>
            </div>
          </dl>
        </div>

        {/* Ảnh signature — slideshow */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative">
            {/* Quầng sáng thuỷ tinh phía sau */}
            <div
              aria-hidden="true"
              className="arch absolute -right-4 -top-4 h-full w-full border border-white/80 bg-white/30 backdrop-blur-md shadow-glass-glow"
            />
            <div className="arch relative aspect-[3/4] w-64 overflow-hidden shadow-2xl ring-1 ring-white/60 sm:w-72 lg:w-96">
              <HeroCarousel images={images} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
