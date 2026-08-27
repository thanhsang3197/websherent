import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { TAG_SAN_PHAM } from '@/lib/internal-api';

/**
 * POST /api/lam-moi — app nội bộ gọi khi có sản phẩm thay đổi.
 *
 * Xoá cache catalogue ngay lập tức thay vì chờ hết 6 giờ. Quan trọng hơn cả
 * tốc độ: với cách chờ hết hạn, NGƯỜI ĐẦU TIÊN vào sau khi shop sửa giá vẫn
 * thấy giá cũ — chính họ là người kích hoạt dựng lại trang, người thứ hai mới
 * thấy giá mới. Với landing ít khách thì một trang có thể giữ giá cũ hàng giờ.
 * Xoá cache chủ động thì người kế tiếp thấy ngay số đúng.
 *
 * ---------------------------------------------------------------------------
 * VÌ SAO CÓ KHOÁ BÍ MẬT
 * ---------------------------------------------------------------------------
 * Không có khoá thì ai cũng gọi được, và mỗi lần gọi là một lần bắt website
 * dựng lại 286 trang. Đó là cách phá hoại rẻ nhất: một vòng lặp curl là site
 * bận suốt ngày dựng lại trang.
 *
 * So khoá bằng `timingSafeEqual` chứ không phải `===`: so chuỗi thường thoát ra
 * ngay ở ký tự đầu khác nhau, nên thời gian phản hồi rò rỉ thông tin về khoá.
 * Đây là kiểu tấn công chậm và khó, nhưng dùng hàm đúng thì cũng chỉ tốn thêm
 * ba dòng.
 */

// Không bao giờ được cache: đây là endpoint gây tác dụng phụ.
export const dynamic = 'force-dynamic';

function khoaDung(header: string | null): boolean {
  const mongDoi = process.env.REVALIDATE_SECRET;
  if (!mongDoi) return false;

  const nhanDuoc = (header ?? '').replace(/^Bearer\s+/i, '');
  // Khác độ dài thì `timingSafeEqual` NÉM LỖI chứ không trả false — phải chặn
  // trước, nếu không endpoint đổ 500 thay vì trả 401.
  if (nhanDuoc.length !== mongDoi.length) return false;

  return timingSafeEqual(Buffer.from(nhanDuoc), Buffer.from(mongDoi));
}

export async function POST(request: Request) {
  if (!process.env.REVALIDATE_SECRET) {
    // Nói rõ là CHƯA CẤU HÌNH, khác hẳn với sai khoá. Thiếu phân biệt này thì
    // lúc gỡ lỗi cứ loay hoay kiểm tra lại khoá trong khi vấn đề là quên khai
    // biến môi trường bên landing.
    return NextResponse.json(
      { ok: false, loi: 'Landing chưa khai REVALIDATE_SECRET.' },
      { status: 503 },
    );
  }

  if (!khoaDung(request.headers.get('authorization'))) {
    return NextResponse.json({ ok: false, loi: 'Sai khoá.' }, { status: 401 });
  }

  revalidateTag(TAG_SAN_PHAM);

  return NextResponse.json({
    ok: true,
    da_lam_moi: TAG_SAN_PHAM,
    luc: new Date().toISOString(),
  });
}
