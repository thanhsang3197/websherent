'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { formatVndD, saleLines, saleNoteLine, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import { trackSaleOpen } from '@/lib/analytics';
import { NEN_O } from '@/lib/thanh-ly';
import { giaFlash, PHAN_TRAM_FLASH } from '@/lib/flash-sale';
import { monMuaTuSanPham } from '@/lib/gio-mua-mon';
import { boKhoiGio, themVaoGio, useGioMua } from '@/lib/gio-mua';
import { bayVaoTui, thongBao } from '@/lib/hieu-ung';

/**
 * Thẻ sản phẩm trên trang THANH LÝ.
 *
 * Nhân vật chính là GIÁ BÁN (phí thuê chỉ là mốc so sánh). Nút chính là "Thêm
 * vào giỏ" (chủ shop chốt 14/11/2026): khách gom nhiều mẫu rồi gửi một tin nhắn
 * cho tiệm ở giỏ mua — components/GioMuaThanhLy.tsx — thay cho nút "Nhắn Zalo
 * mua" từng mẫu trước đây.
 *
 * `flash`: mẫu đang trong flash sale 48 giờ (lib/flash-sale.ts) -> nhãn −10% và
 * giá đã giảm, giá pass gốc gạch ngang.
 */
export function SaleCard({
  product,
  priority = false,
  nen = NEN_O[0],
  flash = false,
}: {
  product: Product;
  /** Ưu tiên tải ảnh cho vài thẻ đầu (LCP). */
  priority?: boolean;
  /** Lớp nền của ô ảnh (một trong NEN_O). */
  nen?: string;
  flash?: boolean;
}) {
  const gio = useGioMua();
  const sale = product.sale;
  if (!sale) return null;

  const trongGio = gio.mon.some((m) => m.id === product.id);
  const coFlash = flash && sale.price > 0;

  const phu = [
    product.category !== 'dam-vay' ? CATEGORY_LABELS[product.category] : null,
    product.brand,
    product.sizes.length ? `Size ${product.sizes.join('/')}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const [dongPass, ...dongKhac] = saleLines(coFlash ? giaFlash(sale.price) : sale.price, product.rentPrice);

  const bam = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (trongGio) {
      boKhoiGio(product.id);
      thongBao({ noiDung: `Đã bỏ ${product.name} khỏi giỏ` });
      return;
    }
    themVaoGio(monMuaTuSanPham(product));
    bayVaoTui(e.currentTarget, '[data-dich-gio]');
    thongBao({ noiDung: `Đã thêm ${product.name} vào giỏ mua` });
  };

  return (
    <div className="group flex h-full w-full flex-col">
      <Link
        href={`/san-pham/${product.slug}`}
        onClick={() => trackSaleOpen(product.id, product.name)}
        className="block"
      >
        {/* Ô màu phẳng, ảnh đặt giữa như một mẫu trong catalogue. */}
        <div className={`${nen} relative p-2.5 transition-colors sm:p-3.5`}>
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

            {coFlash && (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12px] font-bold text-white shadow-md sm:text-[13px]">
                <IconSet /> −{PHAN_TRAM_FLASH}%
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-2 text-base font-medium leading-snug text-ink transition-colors group-hover:text-accent-dark sm:text-lg">
            {product.name}
          </h3>
          {phu && <p className="mt-0.5 line-clamp-2 text-[13px] text-ink/65 sm:text-sm">{phu}</p>}

          {/* Giá và tình trạng dùng CHUNG một cỡ chữ và một font (font nền của
              trang, không phải font serif của tiêu đề) — chủ shop chốt
              13/08/2026: các dòng phải trông như một đoạn viết tay. Flash sale
              chỉ thêm giá gốc gạch ngang cùng dòng, không đổi khuôn chữ. */}
          <p className="mt-2 text-sm font-semibold text-accent-dark sm:text-[15px]">
            {dongPass}
            {coFlash && (
              <s className="ml-1.5 font-normal text-ink/45">{formatVndD(sale.price)}</s>
            )}
          </p>
          {dongKhac.map((line) => (
            <p key={line} className="mt-0.5 text-sm font-semibold text-accent-dark sm:text-[15px]">
              {line}
            </p>
          ))}
          {sale.note && (
            <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-accent-dark sm:text-[15px]">
              {saleNoteLine(sale.note)}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-3 flex-1" />

      <button
        type="button"
        onClick={bam}
        aria-pressed={trongGio}
        aria-label={trongGio ? `Bỏ ${product.name} khỏi giỏ mua` : `Thêm ${product.name} (mã ${product.id}) vào giỏ mua`}
        className={`flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full px-3 text-[15px] font-medium transition active:scale-[0.97] ${
          trongGio
            ? 'bg-accent/15 text-accent-dark hover:bg-accent/25'
            : 'bg-ink text-surface hover:bg-accent-dark'
        }`}
      >
        {/* Chữ ngắn để vừa ô 2 cột trên điện thoại ở CẢ HAI trạng thái. */}
        {trongGio ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
            Đã trong giỏ
          </>
        ) : (
          'Thêm vào giỏ'
        )}
      </button>
    </div>
  );
}

/** Tia sét nhỏ cho nhãn flash sale. */
export function IconSet({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 2 4 14h7l-1.5 8L20 10h-7z" />
    </svg>
  );
}
