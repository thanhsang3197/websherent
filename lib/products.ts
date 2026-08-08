import 'server-only';

/**
 * CỬA TRUY CẬP DỮ LIỆU DUY NHẤT của app.
 * RSC (page) và Route Handler đều gọi qua đây -> sau này đổi nguồn
 * (mock -> Google Sheets -> Supabase) chỉ sửa 1 file.
 */

import type { Product, ProductCategory } from '../types/product';
import { fetchProductsFromSheet, isSheetsConfigured } from './sheets';
import { fetchProductsFromInternalApi, isInternalApiConfigured } from './internal-api';
import { sortProductsForDisplay, groupProducts } from './mapping';
import { mockProducts } from './mock-data';

/** Gộp mẫu nhiều size thành 1, rồi sắp xếp hiển thị. */
function prepare(products: Product[]): Product[] {
  return sortProductsForDisplay(groupProducts(products));
}

/**
 * Lấy toàn bộ sản phẩm (đã sort: có ảnh lên đầu, rồi theo tên).
 * Ưu tiên WebApp Nội Bộ -> Google Sheets -> Fallback mock-data.
 */
export function getProducts(): Promise<Product[]> | Product[] {
  if (isInternalApiConfigured()) {
    return fetchProductsFromInternalApi()
      .then((fromApi) => (fromApi.length > 0 ? prepare(fromApi) : prepare(mockProducts)))
      .catch((err) => {
        console.error('[products] Lỗi đọc WebApp Nội Bộ — dùng mock-data:', err);
        return prepare(mockProducts);
      });
  }

  if (isSheetsConfigured()) {
    return fetchProductsFromSheet()
      .then((fromSheet) => (fromSheet.length > 0 ? prepare(fromSheet) : prepare(mockProducts)))
      .catch((err) => {
        console.error('[products] Lỗi đọc Google Sheets — dùng mock-data:', err);
        return prepare(mockProducts);
      });
  }

  return prepare(mockProducts);
}

/** Tìm 1 sản phẩm theo slug. null nếu không có. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

/**
 * Gợi ý mẫu tương tự. CHỈ lấy mẫu CÓ ẢNH (để khách xem được hình), rồi sắp xếp ưu tiên:
 *   1) Cùng size (có chung ít nhất 1 size với mẫu đang xem)
 *   2) Cùng thương hiệu
 *   3) Phí thuê cao -> thấp
 *   (4) Cùng giá thì theo tên cho ổn định)
 */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getProducts();
  const candidates = all.filter((p) => p.id !== product.id && p.image);

  const sharesSize = (p: Product) =>
    p.sizes.some((s) => product.sizes.includes(s));

  return candidates
    .sort((a, b) => {
      // 1) cùng size
      const aSize = sharesSize(a) ? 0 : 1;
      const bSize = sharesSize(b) ? 0 : 1;
      if (aSize !== bSize) return aSize - bSize;
      // 2) cùng brand
      const aBrand = a.brand && a.brand === product.brand ? 0 : 1;
      const bBrand = b.brand && b.brand === product.brand ? 0 : 1;
      if (aBrand !== bBrand) return aBrand - bBrand;
      // 3) phí thuê cao -> thấp
      if (b.rentPrice !== a.rentPrice) return b.rentPrice - a.rentPrice;
      return a.name.localeCompare(b.name, 'vi');
    })
    .slice(0, limit);
}

/** Danh sách slug cho generateStaticParams (SSG mọi trang chi tiết). */
export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}

/** Đếm số sản phẩm theo loại (dùng cho nội dung/summary). */
export function countByCategory(
  products: Product[],
): Record<ProductCategory, number> {
  return products.reduce(
    (acc, p) => {
      acc[p.category] += 1;
      return acc;
    },
    { 'ao-dai': 0, 'dam-vay': 0, 'phap-phuc': 0 } as Record<ProductCategory, number>,
  );
}
