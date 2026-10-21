import { unstable_cache } from 'next/cache';

/**
 * POST /api/tra-hang — ô "Tra hạng" ở trang /hang-thanh-vien.
 *
 * Body `{ "sdt": "0987..." }` -> `{ "ma": "VIP", "ten": "Vàng" }`. Trình duyệt
 * gọi route này; route này mới gọi app (`POST /api/cong-khai/tra-hang`,
 * api-cong-khai.md §2.8) kèm khoá bí mật `TRA_HANG_KHOA` — app không mở cho
 * trình duyệt, nên đây là cửa DUY NHẤT để tra, và giới hạn số lần tra nằm ở đây.
 *
 * Supabase đang ở gói Free nên mọi việc chặn / nhớ đều làm trên Vercel:
 * - Giới hạn 5 lượt / phút / IP trong bộ nhớ của hàm (lớp phụ; lớp chính là
 *   luật Vercel Firewall chủ shop đặt cho đường dẫn này).
 * - Nhớ kết quả mỗi số 10 phút (Data Cache), cùng một số tra lại không hỏi app.
 */

export const dynamic = 'force-dynamic';

const LUOT_MOI_PHUT = 5;
const NHO_KET_QUA_GIAY = 600;

/** IP -> các mốc thời gian tra trong 60 giây gần nhất. Mất khi hàm khởi động lại — chấp nhận được. */
const daTra = new Map<string, number[]>();

function quaGioiHan(ip: string, now = Date.now()): boolean {
  const gan = (daTra.get(ip) ?? []).filter((t) => now - t < 60_000);
  gan.push(now);
  daTra.set(ip, gan);
  // Dọn bớt để Map không phình mãi khi có bot đổi IP liên tục.
  if (daTra.size > 5000) daTra.clear();
  return gan.length > LUOT_MOI_PHUT;
}

/** Bỏ khoảng trắng / gạch / +84 — app vẫn chuẩn hoá lại, đây chỉ để khoá cache gọn một dạng. */
function chuanHoa(raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length > 32) return null;
  let s = raw.replace(/[\s\-().]/g, '');
  if (s.startsWith('+84')) s = '0' + s.slice(3);
  else if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2);
  return /^0\d{9}$/.test(s) ? s : null;
}

interface KetQua {
  ma: string;
  ten: string;
}

const hoiApp = unstable_cache(
  async (sdt: string): Promise<KetQua> => {
    const base = (process.env.INTERNAL_API_URL ?? '').replace(/\/$/, '');
    const res = await fetch(`${base}/tra-hang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sherent-khoa': process.env.TRA_HANG_KHOA ?? '',
      },
      body: JSON.stringify({ sdt }),
      cache: 'no-store',
    });
    // Ném lỗi thì unstable_cache KHÔNG lưu — lần sau hỏi lại, không kẹt lỗi 10 phút.
    if (!res.ok) throw new Error(`App trả ${res.status} (tra-hang)`);
    const d = (await res.json()) as Partial<KetQua>;
    if (typeof d.ma !== 'string') throw new Error('App trả dữ liệu lạ (tra-hang)');
    return { ma: d.ma, ten: typeof d.ten === 'string' ? d.ten : d.ma };
  },
  ['tra-hang'],
  { revalidate: NHO_KET_QUA_GIAY },
);

const tra = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: Request) {
  // Chỉ nhận lời gọi từ chính trang web (trình duyệt luôn gửi Origin với POST).
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) {
    return tra({ loi: 'Không có quyền.' }, 403);
  }

  if (!process.env.INTERNAL_API_URL || !process.env.TRA_HANG_KHOA) {
    return tra({ loi: 'Tính năng tra hạng chưa được bật.' }, 503);
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'khong-ro';
  if (quaGioiHan(ip)) {
    return tra({ loi: 'Bạn tra hơi nhanh, đợi một phút rồi thử lại nhé.' }, 429);
  }

  const sdt = chuanHoa(((await req.json().catch(() => null)) as { sdt?: unknown } | null)?.sdt);
  if (!sdt) return tra({ loi: 'Số điện thoại chưa đúng, bạn kiểm tra lại giúp tiệm nhé.' }, 400);

  try {
    return tra(await hoiApp(sdt));
  } catch (err) {
    console.error('[api/tra-hang]', err);
    return tra({ loi: 'Chưa tra được, bạn thử lại sau ít phút nhé.' }, 502);
  }
}
