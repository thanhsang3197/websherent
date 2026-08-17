'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { SO_MAU_MOI_VE } from '@/lib/site-config';

/** Bao lâu (giây) một mẫu "chiếm chỗ" khi băng chuyền trôi — §2.2 chốt ~3s/mẫu. */
const GIAY_MOI_MAU = 3;

/**
 * Số mẫu tối thiểu để CHẠY băng chuyền. Track phải lặp danh sách 2 lần để
 * animation liền mạch (xem bên dưới) — nếu shop mới chọn 1-2 mẫu, lặp lại
 * sẽ cho khách thấy 2 tấm y hệt nhau trôi cạnh nhau, trông như lỗi trùng chứ
 * không giống hiệu ứng băng chuyền. Ít hơn ngưỡng này thì hiện tĩnh, không
 * lặp, không animation.
 */
const TOI_THIEU_DE_CHAY_BANG_CHUYEN = 3;

/**
 * "Sản phẩm mới về" — hàng mới do shop tự chọn bên app.
 *
 * THAY cho khối "Mẫu bạn đã xem" cũ (chủ shop chốt 16/08/2026). Khác biệt lớn
 * nhất: khối cũ đọc localStorage nên mỗi khách thấy một kiểu và khách vào lần
 * đầu thì trống trơn; khối này hiện GIỐNG HỆT NHAU với mọi khách vì đây là thứ
 * shop muốn đẩy, không phải lịch sử duyệt.
 *
 * 18/08/2026 chủ shop chốt thêm: chạy dạng băng chuyền tự trôi trái -> phải,
 * lặp vô hạn, dừng khi hover/chạm, và tôn trọng prefers-reduced-motion (khi đó
 * hiện danh sách tĩnh cuộn tay, giống ProductCarousel).
 *
 * Ba điều bắt buộc theo §2.2, đều đã làm ở đây:
 *  1. Chỉ render 8 mẫu đầu — shop lỡ chọn nhiều hơn là vỡ bố cục. App có cảnh
 *     báo nhưng vẫn cắt ở phía web cho chắc.
 *  2. Rỗng thì ẩn CẢ KHỐI, kể cả tiêu đề.
 *  3. Thiếu mẫu thì để thiếu, KHÔNG độn thêm mẫu từ catalogue cho đủ hàng —
 *     khách sẽ tưởng mẫu độn vào cũng là hàng mới.
 */
export function NewArrivalsSection({ products }: { products: Product[] }) {
  const items = products.slice(0, SO_MAU_MOI_VE);
  const [paused, setPaused] = useState(false);

  if (items.length === 0) return null;

  const chayBangChuyen = items.length >= TOI_THIEU_DE_CHAY_BANG_CHUYEN;

  // Track lặp lại danh sách 2 lần để animation -50% -> 0% liền mạch, không
  // giật (xem keyframes 'marquee-right' trong tailwind.config.ts). Bản lặp
  // thứ hai bị ẩn hẳn khi prefers-reduced-motion để không hiện danh sách đôi.
  // Không lặp khi chưa đủ mẫu để chạy băng chuyền (xem TOI_THIEU_DE_CHAY_BANG_CHUYEN).
  const track = chayBangChuyen ? [...items, ...items] : items;
  const durationSec = items.length * GIAY_MOI_MAU;

  return (
    <section className="container-content py-10">
      <h2 className="font-serif text-2xl text-accent-dark sm:text-3xl">
        Sản phẩm mới về
      </h2>

      <div
        className={
          chayBangChuyen
            ? 'relative mt-6 overflow-hidden motion-reduce:overflow-x-auto motion-reduce:[-ms-overflow-style:none] motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden'
            : 'relative mt-6'
        }
        onMouseEnter={chayBangChuyen ? () => setPaused(true) : undefined}
        onMouseLeave={chayBangChuyen ? () => setPaused(false) : undefined}
        onTouchStart={chayBangChuyen ? () => setPaused(true) : undefined}
        onTouchEnd={chayBangChuyen ? () => setPaused(false) : undefined}
      >
        <ul
          className={
            chayBangChuyen
              ? 'flex w-max gap-4 motion-safe:animate-marquee-right'
              : 'flex flex-wrap gap-4'
          }
          style={
            chayBangChuyen
              ? {
                  animationDuration: `${durationSec}s`,
                  animationPlayState: paused ? 'paused' : 'running',
                }
              : undefined
          }
        >
          {track.map((product, i) => {
            const isDup = chayBangChuyen && i >= items.length;
            return (
              <li
                key={`${product.id}-${i}`}
                className={
                  isDup
                    ? 'w-[42vw] shrink-0 sm:w-52 lg:w-56 motion-reduce:hidden'
                    : 'w-[42vw] shrink-0 sm:w-52 lg:w-56'
                }
                aria-hidden={isDup || undefined}
                // Bản lặp chỉ để animation liền mạch — khoá tương tác bàn phím
                // (inert không có trong kiểu HTMLAttributes của React 18 nên
                // ép kiểu tại chỗ) để Tab không lạc vào link trùng đang ẩn mắt.
                {...(isDup ? ({ inert: '' } as unknown as Record<string, string>) : {})}
              >
                {/* Khối nằm ngay đầu trang nên ảnh vào vùng nhìn thấy sớm ->
                    ưu tiên tải cho bản gốc, tránh khách thấy ô trống lúc mới mở
                    trang. Bản lặp không cần ưu tiên (nằm ngoài khung hình). */}
                <ProductCard product={product} priority={!isDup} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
