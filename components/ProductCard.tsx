import { AnhHienDan } from '@/components/AnhHienDan';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatVnd, GLASS_BLUR_DATA_URL, listRentPrice } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import { NhanNoiBat } from '@/components/NhanNoiBat';
import { NutTui } from '@/components/NutTui';
import { monTuSanPham } from '@/lib/tui-do-mon';

/**
 * Thẻ sản phẩm trong lưới. Ảnh khung vòm; mẫu chưa có ảnh -> placeholder thanh lịch.
 * Nút ♡ góc ảnh = thêm vào "Túi đồ muốn thuê" (13/11/2026; nút Yêu thích cũ
 * đã bỏ 02/10/2026 — đây là tính năng mới, gửi được cả danh sách cho tiệm).
 */
export function ProductCard({
  product,
  priority = false,
  hideNew = false,
}: {
  product: Product;
  priority?: boolean;
  /** Khối "Sản phẩm mới về": mẫu nào cũng mới, gắn NEW lên hết thì thừa. */
  hideNew?: boolean;
}) {
  const rent = listRentPrice(product);
  return (
    <div className="relative group">
      <Link
        href={`/san-pham/${product.slug}`}
        className="block focus:outline-none"
      >
        <div className="arch relative aspect-[3/4] overflow-hidden bg-tint shadow-md ring-1 ring-white/70 transition-all duration-300 group-hover:shadow-glass-hover group-hover:ring-accent/50 group-focus-visible:ring-2 group-focus-visible:ring-accent">
          {product.image ? (
            <AnhHienDan
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

          {/* Nhãn loại ("Áo dài", "Pháp phục"…) góc trên ảnh đã bỏ theo yêu
              cầu chủ shop 02/10/2026. */}

          <NhanNoiBat hot={product.hot} isNew={product.isNew && !hideNew} />

          {/* Nút "Xem nhanh" (cửa sổ nổi) đã bỏ theo yêu cầu chủ shop
              02/10/2026 — bấm thẻ là vào thẳng trang chi tiết. */}
        </div>

        <div className="mt-3">
          {/* Tên tối đa 2 dòng ở mọi màn hình (13/11/2026): trước đây điện
              thoại chỉ 1 dòng nên tên áo dài kiểu "AD25 Tịch Nhiên Hồng Ruốc"
              bị cắt mất màu — đúng phần khách cần đọc. Từ sm trở lên giữ min-h
              để các thẻ thẳng hàng. */}
          <h3 className="line-clamp-2 font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent-dark sm:min-h-[3.1rem] sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
            {[product.brand, product.sizes.length ? product.sizes.join('/') : null]
              .filter(Boolean)
              .join(' · ') || ' '}
          </p>
          {/*
            Ba dòng giá LUÔN cùng cỡ chữ với nhau: nhãn nhạt, SỐ in đậm — khách
            lướt lưới là bắt được ngay con số, không phải đọc cả câu.

            Trên điện thoại cỡ chữ CO THEO BỀ RỘNG MÁY, từ sm trở lên mới cố
            định text-sm.

            Lý do: lưới điện thoại là 2 cột nên ô hẹp dần theo máy — đo thật:
            375px -> ô 157px, 360px -> 151px, 320px -> 134px. Dòng "Phí thuê:
            330.000₫ / 3 ngày" ở text-sm cần 184px, ở text-xs cần 156px: máy
            375 vừa khít 1px, còn 360 và 320 vẫn tràn sang thẻ bên cạnh. Một cỡ
            chữ cố định không thể vừa cả dải máy đó, nên dùng clamp().

            Chỉ thu nhỏ riêng "/ 3 ngày" thì không cứu được: ở 375px còn thiếu
            26px, mà cả cụm đó ở text-xs mới rộng chừng 46px.
          */}
          {/*
            13/11/2026 — rà cỡ chữ: điện thoại trước đây co giá xuống 10–11,6px
            (dưới mức dễ đọc). Nay điện thoại bỏ chữ "Phí thuê:" (con số màu
            hồng đứng đầu đã đủ nghĩa), để SỐ to 15px và chú thích tối thiểu
            12px vẫn vừa ô hẹp nhất (máy 320px, ô ~134px). Từ sm giữ nguyên.
          */}
          <p className="mt-1.5 whitespace-nowrap text-xs text-muted sm:mt-2 sm:text-sm">
            <span className="hidden sm:inline">Phí thuê: </span>
            <span className="text-[15px] font-bold text-accent-dark sm:text-sm sm:font-semibold">
              {formatVnd(rent.price)}
            </span>
            {/*
              Hậu tố nhỏ hơn nhãn một nấc — nó là chú thích, không phải giá.
              Dùng `em` chứ không phải cỡ tuyệt đối: nó tự co theo clamp() của
              dòng cha, khỏi phải viết thêm một clamp thứ hai cho khớp.
            */}
            <span className="text-muted sm:text-xs"> / {rent.days} ngày</span>
          </p>
          {/*
            Phí cọc: 0 = Sheet/app chưa điền, KHÔNG phải "cọc 0đ". `formatVnd`
            trả "Liên hệ" cho số 0 — hợp với giá thuê nhưng đọc thành "Phí cọc:
            Liên hệ" thì vô nghĩa, nên ẩn hẳn dòng này thay vì hiện chữ đó.
          */}
          {product.depositPrice > 0 && (
            <p className="mt-0.5 whitespace-nowrap text-xs text-muted sm:text-sm">
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
            <p className="mt-0.5 whitespace-nowrap text-xs text-muted sm:text-sm">
              Giá tag:{' '}
              <span className="font-semibold text-ink">
                {formatVnd(product.tagPrice)}
              </span>
            </p>
          )}
        </div>
      </Link>

      {/* Lớp phủ cùng khung ảnh 3:4 — chỉ nút ♡ nhận bấm, phần còn lại để
          cú bấm rơi xuống link bên dưới. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[3/4]">
        <NutTui mon={monTuSanPham(product)} className="pointer-events-auto absolute bottom-2 right-2" />
      </div>
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
