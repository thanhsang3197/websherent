'use client';

import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatVndD, saleLines, saleNoteLine } from '@/lib/format';
import { giaFlash, PHAN_TRAM_FLASH } from '@/lib/flash-sale';
import { useConLai, useMauFlash } from '@/lib/use-flash-sale';
import { monMuaTuSanPham } from '@/lib/gio-mua-mon';
import { boKhoiGio, themVaoGio, useGioMua } from '@/lib/gio-mua';
import { thongBao } from '@/lib/hieu-ung';
import { IconSet } from '@/components/SaleCard';

/**
 * Khung "Mẫu này đang pass" trên trang chi tiết sản phẩm.
 *
 * Phải hiện ĐÚNG giá flash sale như thẻ ở /thanh-ly — không thì khách bấm vào
 * mẫu −10% lại thấy giá cao hơn. Muốn biết mẫu có đang flash hay không phải
 * bốc lại từ TOÀN BỘ danh sách đang pass (lib/flash-sale.ts), nên trang truyền
 * vào `dsPass` (chỉ mã + giá, cho nhẹ).
 */
export function KhungPass({ product, dsPass }: { product: Product; dsPass: Pick<Product, 'id' | 'sale'>[] }) {
  const { dot, ids } = useMauFlash(dsPass);
  const conLai = useConLai(dot);
  const gio = useGioMua();
  const sale = product.sale;
  if (!sale) return null;

  const coFlash = ids.has(product.id) && sale.price > 0;
  const trongGio = gio.mon.some((m) => m.id === product.id);
  const [dongPass, ...dongKhac] = saleLines(coFlash ? giaFlash(sale.price) : sale.price, product.rentPrice);

  return (
    <div className="mt-4 max-w-md rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-dark">Mẫu này đang pass</p>
        {coFlash && (
          <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12px] font-bold text-white">
            <IconSet /> Flash sale −{PHAN_TRAM_FLASH}%
          </span>
        )}
      </div>

      {/* Cùng câu chữ, cùng cỡ chữ với thẻ ở trang /thanh-ly. */}
      <div className="mt-1.5 space-y-0.5 text-sm font-medium text-accent-dark">
        <p>
          {dongPass}
          {coFlash && <s className="ml-1.5 font-normal text-ink/45">{formatVndD(sale.price)}</s>}
        </p>
        {dongKhac.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {sale.note && <p className="mt-1 text-sm text-muted">{saleNoteLine(sale.note)}</p>}

      {coFlash && conLai && (
        <p className="mt-1.5 text-[13px] font-semibold text-ink tabular-nums">
          Giá flash còn {conLai.ngay > 0 ? `${conLai.ngay} ngày ` : ''}
          {conLai.gio}:{conLai.phut}:{conLai.giay}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => {
            if (trongGio) {
              boKhoiGio(product.id);
              thongBao({ noiDung: `Đã bỏ ${product.name} khỏi giỏ mua` });
            } else {
              themVaoGio(monMuaTuSanPham(product));
              thongBao({ noiDung: `Đã thêm ${product.name} vào giỏ mua`, link: { nhan: 'Xem giỏ', href: '/thanh-ly' } });
            }
          }}
          aria-pressed={trongGio}
          className={`flex min-h-[44px] items-center justify-center rounded-full px-5 text-[15px] font-medium transition active:scale-[0.97] ${
            trongGio ? 'bg-accent/15 text-accent-dark hover:bg-accent/25' : 'bg-ink text-surface hover:bg-accent-dark'
          }`}
        >
          {trongGio ? '✓ Đã trong giỏ mua' : 'Mua mẫu này'}
        </button>
        <Link
          href="/thanh-ly"
          className="text-sm font-medium text-accent-dark underline underline-offset-4 hover:text-accent"
        >
          {trongGio ? 'Xem giỏ & gửi đơn' : 'Xem tất cả mẫu thanh lý'}
        </Link>
      </div>
    </div>
  );
}
