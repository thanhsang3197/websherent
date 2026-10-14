import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatVnd, GLASS_BLUR_DATA_URL, listRentPrice } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';

/**
 * Thẻ sản phẩm trong lưới. Ảnh khung vòm; mẫu chưa có ảnh -> placeholder thanh lịch.
 * (Nút ❤ yêu thích trên góc ảnh đã bỏ cùng cả tính năng Yêu thích, 02/10/2026.)
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

          {/* Nhãn loại ("Áo dài", "Pháp phục"…) góc trên ảnh đã bỏ theo yêu
              cầu chủ shop 02/10/2026. */}

          <NhanNoiBat hot={product.hot} isNew={product.isNew && !hideNew} />

          {/* Nút "Xem nhanh" (cửa sổ nổi) đã bỏ theo yêu cầu chủ shop
              02/10/2026 — bấm thẻ là vào thẳng trang chi tiết. */}
        </div>

        <div className="mt-3">
          {/* Điện thoại: tên 1 dòng (cắt "…" nếu dài), không chừa sẵn dòng 2 —
              đỡ khoảng trống. Từ sm trở lên: 2 dòng, giữ min-h để các thẻ thẳng hàng. */}
          <h3 className="line-clamp-1 font-serif text-base leading-snug text-ink transition-colors group-hover:text-accent-dark sm:line-clamp-2 sm:min-h-[3.1rem] sm:text-lg">
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
          <p className="mt-2 whitespace-nowrap text-[clamp(10px,3.1vw,12px)] text-muted sm:text-sm">
            Phí thuê:{' '}
            <span className="font-semibold text-accent-dark">
              {formatVnd(rent.price)}
            </span>
            {/*
              Hậu tố nhỏ hơn nhãn một nấc — nó là chú thích, không phải giá.
              Dùng `em` chứ không phải cỡ tuyệt đối: nó tự co theo clamp() của
              dòng cha, khỏi phải viết thêm một clamp thứ hai cho khớp.
            */}
            <span className="text-[0.85em] text-muted"> / {rent.days} ngày</span>
          </p>
          {/*
            Phí cọc: 0 = Sheet/app chưa điền, KHÔNG phải "cọc 0đ". `formatVnd`
            trả "Liên hệ" cho số 0 — hợp với giá thuê nhưng đọc thành "Phí cọc:
            Liên hệ" thì vô nghĩa, nên ẩn hẳn dòng này thay vì hiện chữ đó.
          */}
          {product.depositPrice > 0 && (
            <p className="mt-0.5 text-[clamp(10px,3.1vw,12px)] text-muted sm:text-sm">
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
            <p className="mt-0.5 text-[clamp(10px,3.1vw,12px)] text-muted sm:text-sm">
              Giá tag:{' '}
              <span className="font-semibold text-ink">
                {formatVnd(product.tagPrice)}
              </span>
            </p>
          )}
        </div>
      </Link>

    </div>
  );
}

/**
 * Nhãn HOT / NEW lấp lánh trên ảnh (chủ shop 15/10/2026) — khơi tò mò để
 * khách bấm vào xem, nhắn hỏi.
 *
 * Đặt GÓC DƯỚI-TRÁI: khung ảnh hình vòm (`.arch`) bo rất sâu ở hai góc trên,
 * nhãn đặt góc trên bị cắt mất nửa; góc dưới chỉ bo 6px và không che mặt mẫu.
 * HOT đứng trước NEW: "được thuê nhiều" là lý do mạnh hơn "mới về".
 * Ánh sáng lướt qua: `.nhan-lap-lanh` trong globals.css (tắt khi khách bật
 * giảm chuyển động).
 */
function NhanNoiBat({ hot, isNew }: { hot?: boolean; isNew?: boolean }) {
  if (!hot && !isNew) return null;
  return (
    <div className="pointer-events-none absolute bottom-2 left-2 flex gap-1 sm:bottom-2.5 sm:left-2.5">
      {hot && (
        <span className="nhan-lap-lanh rounded-full bg-gradient-to-r from-[#c2412d] to-[#e8774a] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-md sm:text-[11px]">
          🔥 HOT
        </span>
      )}
      {isNew && (
        <span className="nhan-lap-lanh rounded-full bg-gradient-to-r from-accent to-accent-dark px-2 py-0.5 text-[10px] font-bold tracking-wider text-surface shadow-md [--nhan-tre:1.2s] sm:text-[11px]">
          ✨ NEW
        </span>
      )}
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
