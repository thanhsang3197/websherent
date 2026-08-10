import 'server-only';
import type { Product } from '@/types/product';
import type { OrderRecord } from '@/lib/orders';
import { normalizeImageUrl } from '@/lib/format';
import { buildProductSlug } from '@/lib/slug';

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
  const rawProducts = Array.isArray(data)
    ? data
    : data.san_pham || data.products || data.data || [];

  // Chuẩn hoá dữ liệu về kiểu Product (Hỗ trợ cả trường tiếng Việt và tiếng Anh)
  return rawProducts.map((item: Record<string, unknown>) => {
    const id = String(item.ma || item.id || item.code || '').trim();
    const name = String(item.ten || item.name || item.title || '').trim();
    const rawCategory = String(item.loai || item.category || '').toUpperCase();

    let category: Product['category'] = 'dam-vay';
    if (rawCategory.includes('AO_DAI') || rawCategory.includes('AO-DAI')) {
      category = 'ao-dai';
    } else if (rawCategory.includes('PHAP_PHUC') || rawCategory.includes('PHAP-PHUC')) {
      category = 'phap-phuc';
    }

    let sizes: string[] = [];
    const rawSize = item.co ?? item.sizes ?? item.size;
    if (Array.isArray(rawSize)) {
      sizes = rawSize.map(String);
    } else if (typeof rawSize === 'string' && rawSize.trim()) {
      sizes = rawSize.split(/[,;/]+/).map((s) => s.trim()).filter(Boolean);
    }

    const mainImage = normalizeImageUrl(String(item.anh || item.image || item.thumbnail || '')) || '';

    let images: string[] = [];
    const rawAnhPhu = item.anh_phu ?? item.images;
    if (Array.isArray(rawAnhPhu)) {
      images = rawAnhPhu.map(String).map((u) => normalizeImageUrl(u) || u).filter(Boolean);
    }
    if (mainImage && !images.includes(mainImage)) {
      images.unshift(mainImage);
    }

    const slug = item.slug
      ? String(item.slug)
      : buildProductSlug(name, id);

    return {
      id,
      slug,
      name,
      brand: item.thuong_hieu ? String(item.thuong_hieu) : item.brand ? String(item.brand) : null,
      sizes,
      category,
      rentPrice: Number(item.gia_thue ?? item.rentPrice ?? item.rent_price ?? 0),
      depositPrice: Number(item.tien_coc ?? item.depositPrice ?? item.deposit_price ?? 0),
      image: mainImage,
      images: images.length > 0 ? images : mainImage ? [mainImage] : [],
    };
  });
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
