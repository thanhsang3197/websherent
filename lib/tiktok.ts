import 'server-only';

interface TikTokOEmbedResponse {
  // Tên trường thật từ API TikTok là "embed_product_id" (đã kiểm chứng trực
  // tiếp) — KHÔNG phải "video_id" như tài liệu cộng đồng hay ghi.
  embed_product_id?: string;
}

/**
 * Lấy video ID thật từ link TikTok qua API oEmbed chính thức — xử lý được cả
 * link ngắn (vm.tiktok.com/...) lẫn link dài, vì TikTok tự phân giải phía họ.
 * Cần ID này (không chỉ URL) thì embed.js mới render đúng video (đã kiểm chứng:
 * chỉ để `cite` không thôi, script không tự đọc được ID -> video ID = null).
 */
export async function resolveTikTokVideoId(url: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as TikTokOEmbedResponse;
    return data.embed_product_id ?? null;
  } catch {
    return null;
  }
}
