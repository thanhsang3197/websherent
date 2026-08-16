import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';

/** Số ô tối đa của khối. Chủ shop chốt 4 (api-cong-khai.md §2.2). */
export const SO_MAU_MOI_VE = 4;

/**
 * "Sản phẩm mới về" — 4 mẫu hàng mới do shop tự chọn bên app.
 *
 * THAY cho khối "Mẫu bạn đã xem" cũ (chủ shop chốt 16/08/2026). Khác biệt lớn
 * nhất: khối cũ đọc localStorage nên mỗi khách thấy một kiểu và khách vào lần
 * đầu thì trống trơn; khối này hiện GIỐNG HỆT NHAU với mọi khách vì đây là thứ
 * shop muốn đẩy, không phải lịch sử duyệt. Nhờ vậy nó cũng dựng được ở server,
 * không cần 'use client'.
 *
 * Ba điều bắt buộc theo §2.2, đều đã làm ở đây:
 *  1. Chỉ render 4 mẫu đầu — shop lỡ chọn 6 mẫu là vỡ bố cục. App có cảnh báo
 *     nhưng vẫn cắt ở phía web cho chắc.
 *  2. Rỗng thì ẩn CẢ KHỐI, kể cả tiêu đề.
 *  3. Thiếu mẫu thì để thiếu, KHÔNG độn thêm mẫu từ catalogue cho đủ hàng —
 *     khách sẽ tưởng mẫu độn vào cũng là hàng mới.
 */
export function NewArrivalsSection({ products }: { products: Product[] }) {
  const items = products.slice(0, SO_MAU_MOI_VE);
  if (items.length === 0) return null;

  return (
    <section className="container-content py-10">
      <h2 className="font-serif text-2xl text-accent-dark sm:text-3xl">
        Sản phẩm mới về
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {items.map((product) => (
          <li key={product.id}>
            {/* Khối nằm ngay đầu trang nên ảnh vào vùng nhìn thấy sớm -> ưu
                tiên tải, tránh khách thấy ô trống lúc mới mở trang. */}
            <ProductCard product={product} priority />
          </li>
        ))}
      </ul>
    </section>
  );
}
