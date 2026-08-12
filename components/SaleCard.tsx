'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { saleLine, saleNoteLine, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';

/**
 * Thẻ sản phẩm trên trang THANH LÝ.
 *
 * Khác `ProductCard` ở chỗ nhân vật chính là GIÁ BÁN, còn phí thuê chỉ là mốc
 * so sánh; và mỗi thẻ có nút Zalo riêng kèm sẵn mã mẫu (khách hay nhắn "cái đầm
 * hồng hồng" rồi cả hai bên đoán nhau).
 *
 * Là client component vì nút Zalo copy nội dung tin nhắn vào clipboard — cùng
 * cách làm với `components/ContactButtons.tsx` (zalo.me không nhận sẵn nội dung
 * tin nhắn qua URL, nên copy rồi để khách dán là đường duy nhất).
 */
export function SaleCard({
  product,
  priority = false,
}: {
  product: Product;
  /** Ưu tiên tải ảnh cho vài thẻ đầu (LCP). */
  priority?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const sale = product.sale;
  if (!sale) return null;

  const message =
    `Hi ${siteConfig.name}, mình muốn MUA mẫu thanh lý: ` +
    `${product.name} (mã ${product.id})` +
    `${product.sizes.length ? ` - size ${product.sizes.join('/')}` : ''}` +
    // Cùng câu chữ với thẻ sản phẩm, để tin nhắn khách gửi khớp đúng thứ họ
    // đang nhìn thấy trên màn hình.
    ` - ${saleLine(sale.price, product.rentPrice)}`;

  const handleZaloClick = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      // Clipboard bị chặn (http, quyền trình duyệt) thì vẫn mở Zalo bình thường.
      .catch(() => {});
  };

  return (
    <div className="group flex h-full flex-col">
      <Link href={`/san-pham/${product.slug}`} className="block focus:outline-none">
        <div className="arch relative aspect-[3/4] overflow-hidden bg-tint shadow-md ring-1 ring-white/70 transition-all duration-300 group-hover:shadow-glass-hover group-hover:ring-accent/50">
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
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-tint">
              <span className="font-serif text-5xl text-accent/45">
                {siteConfig.name.charAt(0)}
              </span>
              <span className="text-[11px] text-muted">Ảnh đang cập nhật</span>
            </div>
          )}

          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent-dark px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-surface shadow-sm">
            Thanh lý
          </span>
          {product.category !== 'dam-vay' && (
            <span className="glass-pill absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-accent-dark shadow-sm">
              {CATEGORY_LABELS[product.category]}
            </span>
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

          {/* Giá và tình trạng dùng CHUNG một cỡ chữ và một font (font nền của
              trang, không phải font serif của tiêu đề) — chủ shop chốt
              13/08/2026: hai dòng phải trông như một đoạn viết tay, không phải
              hai mảng thiết kế khác nhau. */}
          <p className="mt-2 text-sm font-medium text-accent-dark">
            {saleLine(sale.price, product.rentPrice)}
          </p>

          {sale.note && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {saleNoteLine(sale.note)}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-3 flex-1" />

      <a
        href={siteConfig.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleZaloClick}
        className="btn btn-primary w-full !py-2 text-xs sm:text-sm"
        aria-label={`Nhắn Zalo mua ${product.name} (mã ${product.id})`}
      >
        {copied ? '✓ Đã copy tin nhắn — mở Zalo' : 'Nhắn Zalo mua mẫu này'}
      </a>
    </div>
  );
}
