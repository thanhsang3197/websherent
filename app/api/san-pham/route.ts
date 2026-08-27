import { NextResponse } from 'next/server';
import { getProducts, getProductBySlug } from '@/lib/products';

/**
 * Route Handler (PHÍA SERVER). Giấu Google Sheets API key: client chỉ gọi endpoint này.
 * CHỈ trả các field public của Product — không bao giờ lộ giá nhập/doanh thu/ROI.
 *
 * GET /api/san-pham            -> { count, products }
 * GET /api/san-pham?slug=xxx   -> { product } | 404
 */
// KHÔNG CÓ TÁC DỤNG, giữ lại cho khỏi hiểu nhầm là quên khai. Hàm GET dưới
// đọc `request.url` để lấy tham số `slug`, mà chạm vào đó là Next loại route
// khỏi cache hoàn toàn -> mọi lượt gọi đều chạy function (đo 28/08/2026:
// X-Vercel-Cache: MISS 3/3 lần). Muốn cache được thì phải bỏ nhánh `?slug=`
// hoặc tách thành route động /api/san-pham/[slug].
// Thực tế route này chỉ tốn 1,36 giây CPU / 12 giờ (17 lượt gọi) nên chưa gấp.
export const revalidate = 21600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy sản phẩm.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ product });
  }

  const products = await getProducts();
  return NextResponse.json({ count: products.length, products });
}
