import { NextResponse } from 'next/server';
import { getProducts, getProductBySlug } from '@/lib/products';

/**
 * Route Handler (PHÍA SERVER). Giấu Google Sheets API key: client chỉ gọi endpoint này.
 * CHỈ trả các field public của Product — không bao giờ lộ giá nhập/doanh thu/ROI.
 *
 * GET /api/san-pham            -> { count, products }
 * GET /api/san-pham?slug=xxx   -> { product } | 404
 */
export const revalidate = 300;

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
