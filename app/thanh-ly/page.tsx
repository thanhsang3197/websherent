import type { Metadata } from 'next';
import Link from 'next/link';
import { getSaleProducts } from '@/lib/products';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { SaleGrid } from '@/components/SaleGrid';
import type { Product } from '@/types/product';

// ISR giống các trang khác. Khi shop sửa giá pass bên app nội bộ, app gọi
// /api/lam-moi -> revalidateTag('san-pham') -> trang này dựng lại ngay, không
// phải chờ hết 300 giây.
export const revalidate = 300;

const TITLE = 'Thanh lý — pass lại đầm, váy & áo dài';
const DESCRIPTION =
  `Các mẫu ${siteConfig.name} đang pass lại (bán đứt) với giá thanh lý. ` +
  `Mẫu vẫn cho thuê song song, ai chốt trước lấy trước. Nhắn Zalo để xem thêm ảnh thật và giữ mẫu.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/thanh-ly' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/thanh-ly`,
    images: [{ url: siteConfig.ogImage }],
  },
};

/** Đếm số mẫu có giá pass rơi vào khoảng (min, max], bỏ mẫu chưa chốt giá (0). */
function countPassRange(products: Product[], min: number, max: number) {
  return products.filter((p) => {
    const price = p.sale?.price ?? 0;
    return price > min && price <= max;
  }).length;
}

export default async function ThanhLyPage() {
  const products = await getSaleProducts();
  const under100k = countPassRange(products, 0, 100_000);
  const under200k = countPassRange(products, 100_000, 200_000);
  const under500k = countPassRange(products, 200_000, 500_000);
  const under1000k = countPassRange(products, 500_000, 1_000_000);

  return (
    <div className="container-content py-12 sm:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">
          Pass lại
        </p>
        <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">
          Sản Phẩm Thanh Lý
        </h1>
        <p className="mt-3 text-muted">
          Những mẫu tiệm đang nhượng lại cho khách với giá bán đứt. Mẫu vẫn cho
          thuê bình thường trong lúc chờ pass, nên ai chốt trước lấy trước, chỉ
          nhận chuyển khoản trước rồi ghé shop nhận đồ hoặc shop ship — nhắn Zalo
          ({siteConfig.phone3.display}) để bọn mình gửi thêm ảnh thật và giữ mẫu
          cho bạn.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="mt-10 rounded-lg border border-hairline bg-tint px-5 py-8 text-center">
          <p className="font-serif text-lg text-accent-dark">
            Hiện chưa có mẫu nào đang pass
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Bạn cứ nhắn Zalo cho tiệm nhu cầu của mình (dáng đầm, size, tầm giá)
            — có mẫu ra là bọn mình báo ngay.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={siteConfig.zaloUrl3}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Nhắn Zalo {siteConfig.phone3.display}
            </a>
            <Link href="/#san-pham" className="btn btn-outline">
              Xem mẫu cho thuê
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 flex justify-center sm:justify-start">
            <p className="animate-promo-badge-glow flex items-center gap-2 rounded-xl border px-3 py-3 text-center text-xs font-semibold sm:gap-3 sm:px-5 sm:text-left sm:text-lg lg:text-xl">
              <span aria-hidden className="animate-promo-icon-bounce inline-block shrink-0 text-lg sm:text-2xl lg:text-3xl">
                🎁
              </span>
              <span>
                <span className="animate-promo-glow whitespace-nowrap">
                  Tặng 1 mẫu giá 50k đối với đơn từ 300k
                  <br />
                  Tặng 1 mẫu giá 100k đối với đơn từ 500k
                </span>
                <span className="mt-1 block text-center text-xs font-normal text-muted sm:text-sm">
                  (CTKM áp dụng cho tới khi hết sản phẩm)
                </span>
              </span>
            </p>
          </div>
          <p className="mt-3 inline-block rounded-md border border-accent-dark/30 bg-tint px-3 py-1.5 text-sm font-normal text-ink">
            <span className="text-base font-bold text-accent-dark">
              {products.length}
            </span>{' '}
            mẫu đang pass, trong đó{' '}
            <span className="text-base font-bold text-accent-dark">
              {under100k}
            </span>{' '}
            mẫu &lt;100k,{' '}
            <span className="text-base font-bold text-accent-dark">
              {under200k}
            </span>{' '}
            mẫu &lt;200k,{' '}
            <span className="text-base font-bold text-accent-dark">
              {under500k}
            </span>{' '}
            mẫu &lt;500k,{' '}
            <span className="text-base font-bold text-accent-dark">
              {under1000k}
            </span>{' '}
            mẫu &lt;1000k
          </p>

          <SaleGrid products={products} />

          {/* Câu chữ do chủ shop viết (13/08/2026) — giữ nguyên, đừng "làm hay
              hơn". Giờ mở cửa và địa chỉ đã có sẵn ở Footer nên bỏ ra khỏi đây. */}
          <p className="mt-12 rounded-lg border border-hairline bg-tint px-4 py-3 text-sm text-muted">
            Giá trên là giá bán, chưa bao gồm phí ship. Có thể xem trực tiếp và
            nhận váy tại tiệm.
          </p>
        </>
      )}
    </div>
  );
}
