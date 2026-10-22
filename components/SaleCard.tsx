'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { saleLine, saleNoteLine, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import { trackSaleOpen, trackZaloClick } from '@/lib/analytics';
import { NEN_O } from '@/lib/thanh-ly';

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
  nen = NEN_O[0],
}: {
  product: Product;
  /** Ưu tiên tải ảnh cho vài thẻ đầu (LCP). */
  priority?: boolean;
  /** Lớp nền của ô ảnh (một trong NEN_O). */
  nen?: string;
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
    trackZaloClick('thanh-ly', product.id);
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      })
      // Clipboard bị chặn (http, quyền trình duyệt) thì vẫn mở Zalo bình thường.
      .catch(() => {});
  };

  const phu = [
    product.category !== 'dam-vay' ? CATEGORY_LABELS[product.category] : null,
    product.brand,
    product.sizes.length ? `Size ${product.sizes.join('/')}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="group flex h-full w-full flex-col">
      <Link
        href={`/san-pham/${product.slug}`}
        onClick={() => trackSaleOpen(product.id, product.name)}
        className="block"
      >
        {/* Ô màu phẳng, ảnh đặt giữa như một mẫu trong catalogue. */}
        <div className={`${nen} p-2.5 transition-colors sm:p-3.5`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-surface/40">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={priority}
                placeholder="blur"
                blurDataURL={GLASS_BLUR_DATA_URL}
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                <span className="font-serif text-5xl text-ink/25">{siteConfig.name.charAt(0)}</span>
                <span className="text-[13px] text-ink/60">Ảnh đang cập nhật</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-2 text-base font-medium leading-snug text-ink transition-colors group-hover:text-accent-dark sm:text-lg">
            {product.name}
          </h3>
          {phu && <p className="mt-0.5 line-clamp-1 text-[13px] text-ink/65 sm:text-sm">{phu}</p>}

          {/* Giá và tình trạng dùng CHUNG một cỡ chữ và một font (font nền của
              trang, không phải font serif của tiêu đề) — chủ shop chốt
              13/08/2026: hai dòng phải trông như một đoạn viết tay, không phải
              hai mảng thiết kế khác nhau. */}
          <p className="mt-2 text-sm font-semibold text-accent-dark sm:text-[15px]">
            {saleLine(sale.price, product.rentPrice)}
          </p>
          {sale.note && (
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-accent-dark sm:text-[15px]">
              {saleNoteLine(sale.note)}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-3 flex-1" />

      <a
        href={siteConfig.zaloUrl3}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleZaloClick}
        className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-ink px-3 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97]"
        aria-label={`Nhắn Zalo mua ${product.name} (mã ${product.id})`}
      >
        {/* Chữ phải ngắn để vừa bề ngang ô trên điện thoại (2 cột). CẢ HAI
            trạng thái đều phải vừa — trạng thái sau khi bấm mà dài là nút vỡ
            đúng lúc khách vừa chạm vào. Tên mẫu + mã SP vẫn nằm trong
            aria-label cho trình đọc màn hình. */}
        {copied ? 'Đã chép tin nhắn' : 'Nhắn Zalo mua'}
      </a>
      <p aria-live="polite" className="mt-1.5 min-h-[1.25rem] text-center text-[13px] text-ink/70">
        {copied ? 'Dán vào khung chat Zalo nhé' : ''}
      </p>
    </div>
  );
}
