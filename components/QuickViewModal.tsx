'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { formatVnd } from '@/lib/format';
import { ProductGallery } from '@/components/ProductGallery';
import { ContactButtons } from '@/components/ContactButtons';
import { FavoriteButton } from '@/components/FavoriteButton';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const categoryLabel = CATEGORY_LABELS[product.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Content Card Liquid Glass */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl glass-panel p-6 shadow-glass-lg animate-in fade-in zoom-in-95 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full glass-pill text-muted transition-colors hover:bg-white hover:text-ink"
          aria-label="Đóng xem nhanh"
        >
          ✕
        </button>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {/* Gallery */}
          <div className="flex justify-center">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
                    {categoryLabel}
                  </span>
                  <h2 id="quick-view-title" className="mt-1 font-serif text-2xl text-accent-dark sm:text-3xl">
                    {product.name}
                  </h2>
                </div>
                <FavoriteButton slug={product.slug} size="md" />
              </div>

              <dl className="mt-4 divide-y divide-hairline border-y border-hairline">
                {product.brand && (
                  <div className="flex justify-between py-2 text-sm">
                    <dt className="text-muted">Thương hiệu</dt>
                    <dd className="font-medium text-ink">{product.brand}</dd>
                  </div>
                )}
                {product.sizes.length > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <dt className="text-muted">Size có sẵn</dt>
                    <dd className="font-medium text-ink">{product.sizes.join(' / ')}</dd>
                  </div>
                )}
                <div className="flex justify-between py-2 text-sm">
                  <dt className="text-muted">Phí thuê</dt>
                  <dd className="font-serif text-lg font-semibold text-accent-dark">
                    {formatVnd(product.rentPrice)}
                  </dd>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <dt className="text-muted">Phí cọc</dt>
                  <dd className="font-serif text-lg font-medium text-ink">
                    {formatVnd(product.depositPrice)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 space-y-3">
              <ContactButtons
                zaloLabel="Nhắn Zalo giữ mẫu này"
                contextLabel={`${product.name} (mã ${product.id})`}
              />
              <Link
                href={`/san-pham/${product.slug}`}
                onClick={onClose}
                className="block text-center text-xs font-medium text-accent-dark underline-offset-4 hover:underline"
              >
                Xem chi tiết trang sản phẩm →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
