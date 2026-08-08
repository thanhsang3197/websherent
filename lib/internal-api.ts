import 'server-only';
import type { Product } from '@/types/product';
import type { OrderRecord } from '@/lib/orders';

/**
 * ADAPTER KẾT NỐI VỚI WEBAPP NỘI BỘ (REST API).
 * Giúp website lấy dữ liệu sản phẩm & đơn hàng trực tiếp từ hệ thống quản lý của tiệm.
 */

export function isInternalApiConfigured(): boolean {
  return Boolean(process.env.INTERNAL_API_URL);
}

/**
 * Lấy danh sách sản phẩm từ WebApp nội bộ.
 */
export async function fetchProductsFromInternalApi(): Promise<Product[]> {
  const apiUrl = process.env.INTERNAL_API_URL;
  const apiKey = process.env.INTERNAL_API_SECRET_KEY;

  if (!apiUrl) throw new Error('Thiếu INTERNAL_API_URL');

  const endpoint = `${apiUrl.replace(/\/$/, '')}/products`;
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    next: { revalidate: Number(process.env.API_REVALIDATE_SECONDS ?? '300') },
  });

  if (!res.ok) {
    throw new Error(`Internal API trả về mã lỗi ${res.status}`);
  }

  const data = await res.json();
  const rawProducts = Array.isArray(data) ? data : data.products || data.data || [];

  // Chuẩn hoá dữ liệu về kiểu Product nếu cần
  return rawProducts.map((item: Record<string, unknown>) => ({
    id: String(item.id || item.code || ''),
    slug: String(item.slug || item.id || ''),
    name: String(item.name || item.title || ''),
    brand: item.brand ? String(item.brand) : null,
    sizes: Array.isArray(item.sizes) ? item.sizes.map(String) : [],
    category: (item.category as Product['category']) || 'dam-vay',
    rentPrice: Number(item.rentPrice || item.rent_price || 0),
    depositPrice: Number(item.depositPrice || item.deposit_price || 0),
    image: String(item.image || item.thumbnail || ''),
    images: Array.isArray(item.images) ? item.images.map(String) : item.image ? [String(item.image)] : [],
  }));
}

/**
 * Lấy danh sách đơn hàng từ WebApp nội bộ để kiểm tra lịch trống.
 */
export async function fetchOrdersFromInternalApi(): Promise<OrderRecord[]> {
  const apiUrl = process.env.INTERNAL_API_URL;
  const apiKey = process.env.INTERNAL_API_SECRET_KEY;

  if (!apiUrl) return [];

  try {
    const endpoint = `${apiUrl.replace(/\/$/, '')}/orders`;
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const rawOrders = Array.isArray(data) ? data : data.orders || data.data || [];

    return rawOrders.map((o: Record<string, unknown>) => ({
      orderId: String(o.orderId || o.id || ''),
      productId: String(o.productId || o.product_id || '').toUpperCase(),
      startDate: String(o.startDate || o.start_date || ''),
      endDate: String(o.endDate || o.end_date || ''),
      status: String(o.status || ''),
    }));
  } catch (err) {
    console.error('Lỗi khi tải lịch đơn hàng từ Internal API:', err);
    return [];
  }
}
