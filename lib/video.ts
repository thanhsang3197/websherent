import 'server-only';
import { resolveTikTokVideoId } from '@/lib/tiktok';
import type { ProductVideo } from '@/types/product';

/**
 * Nhận link Instagram (bài đăng / Reels) hoặc TikTok, trả link nhúng.
 * Link lạ, hỏng, hoặc TikTok không tra được ID -> null: web ẩn ô video chứ
 * không hiện khung trống.
 */
export async function resolveProductVideo(
  raw: string | null | undefined,
): Promise<ProductVideo | null> {
  const link = (raw ?? '').trim();
  if (!link) return null;

  let url: URL;
  try {
    url = new URL(link.startsWith('http') ? link : `https://${link}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');

  // instagram.com/p/<mã>, /reel/<mã>, /reels/<mã>, /tv/<mã>. Link nhúng /p/
  // chạy được cho cả Reels. Không cần khoá API như oEmbed của Meta.
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
    const m = url.pathname.match(/\/(?:p|reels?|tv)\/([A-Za-z0-9_-]+)/);
    return m
      ? { kind: 'instagram', embedUrl: `https://www.instagram.com/p/${m[1]}/embed/` }
      : null;
  }

  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    // Link dài có sẵn ID; link ngắn (vm./vt.tiktok.com) phải tra qua oEmbed.
    const id =
      url.pathname.match(/\/video\/(\d+)/)?.[1] ??
      (await resolveTikTokVideoId(url.toString()));
    // /player/v1 = trình phát trần (chỉ có video), gọn hơn khung embed đầy đủ.
    return id
      ? { kind: 'tiktok', embedUrl: `https://www.tiktok.com/player/v1/${id}` }
      : null;
  }

  return null;
}
