import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { formatVnd, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import { FavoriteButton } from '@/components/FavoriteButton';

/**
 * Thẻ sản phẩm trong lưới. Ảnh khung vòm; mẫu chưa có ảnh -> placeholder thanh lịch.
 * Bọc ngoài bằng <div relative> để nút yêu thích là ANH EM của <Link>, không lồng
 * bên trong (tránh <button> nằm trong <a>, sai chuẩn HTML).
 */
export function ProductCard({
  product,
  priority = false,
  onQuickView,
}: {
  product: Product;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}) {
  return (
    <div className="relative group">
      <Link
        href={`/san-pham/${product.slug}`}
        className="block focus:outline-none"
      >
        <div className="arch relative aspect-[3/4] overflow-hidden bg-tint shadow-md ring-1 ring-white/70 transition-all duration-300 group-hover:shadow-glass-hover group-hover:ring-accent/50 group-focus-visible:ring-2 group-focus-visible:ring-accent">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              placeholder="blur"
              blurDataURL={GLASS_BLUR_DATA_URL}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            />
          ) : (
            <CardPlaceholder />
          )}

          {product.category !== 'dam-vay' && (
            <span className="glass-pill absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-accent-dark shadow-sm">
              {CATEGORY_LABELS[product.category]}
            </span>
          )}

          {/* Nút Xem nhanh (Quick View Overlay Liquid Glass) */}
          {onQuickView && (
            <div className="absolute inset-x-0 bottom-0 p-2.5 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:p-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="w-full rounded-full bg-white/80 py-2.5 text-xs font-semibold text-accent-dark shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-[1.03] active:scale-95"
              >
                👁️ Xem nhanh
              </button>
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-2 min-h-[2.75rem] font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent-dark sm:min-h-[3.1rem] sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
            {[product.brand, product.sizes.length ? product.sizes.join('/') : null]
              .filter(Boolean)
              .join(' · ') || ' '}
          </p>
          {/*
            Ba dòng giá cùng cỡ chữ (text-sm): nhãn nhạt, SỐ in đậm — khách lướt
            lưới là bắt được ngay con số, không phải đọc cả câu.
          */}
          <p className="mt-2 text-sm text-muted">
            Phí thuê:{' '}
            <span className="font-semibold text-accent-dark">
              {formatVnd(product.rentPrice)}
            </span>
            <span className="text-muted"> / 3 ngày</span>
          </p>
          {/*
            Phí cọc: 0 = Sheet/app chưa điền, KHÔNG phải "cọc 0đ". `formatVnd`
            trả "Liên hệ" cho số 0 — hợp với giá thuê nhưng đọc thành "Phí cọc:
            Liên hệ" thì vô nghĩa, nên ẩn hẳn dòng này thay vì hiện chữ đó.
          */}
          {product.depositPrice > 0 && (
            <p className="mt-0.5 text-sm text-muted">
              Phí cọc:{' '}
              <span className="font-semibold text-ink">
                {formatVnd(product.depositPrice)}
              </span>
            </p>
          )}
          {/*
            Giá tag = giá gốc trên nhãn của chiếc đầm, KHÔNG phải giá thuê.
            `null` = shop chưa nhập -> ẩn hẳn dòng (api-cong-khai.md §2), chứ
            không hiện "0đ" hay "Liên hệ" — cả hai đều nói sai với khách.
          */}
          {product.tagPrice != null && (
            <p className="mt-0.5 text-sm text-muted">
              Giá tag:{' '}
              <span className="font-semibold text-ink">
                {formatVnd(product.tagPrice)}
              </span>
            </p>
          )}
        </div>
      </Link>

      <FavoriteButton slug={product.slug} className="absolute right-2 top-2 z-10" />
    </div>
  );
}

function CardPlaceholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-tint">
      <span className="font-serif text-5xl text-accent/45">
        {siteConfig.name.charAt(0)}
      </span>
      <span className="text-[11px] text-muted">Ảnh đang cập nhật</span>
    </div>
  );
}
