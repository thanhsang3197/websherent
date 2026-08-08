import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { formatVnd } from '@/lib/format';
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
          <p className="mt-2 text-sm font-semibold text-accent-dark">
            {formatVnd(product.rentPrice)}
            <span className="font-normal text-muted"> / 3 ngày</span>
          </p>
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
