'use client';

import Link from 'next/link';

/**
 * App nội bộ lỗi (502, mạng…) khi dựng trang album — §2.4: hiện thông báo
 * chung, KHÔNG hiện chi tiết lỗi.
 *
 * Lỗi được ném ra thay vì vẽ thông báo ngay trong page.tsx: trang ISR mà vẽ
 * thông báo lỗi thì bản đó bị lưu cache 7 ngày; ném lỗi thì Next giữ bản trang
 * cũ còn tốt, chỉ lượt đầu tiên (chưa có bản nào) mới thấy màn hình này.
 */
export default function AlbumError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-content py-16 text-center">
      <p className="font-serif text-2xl text-accent-dark">Chưa tải được album</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Bạn thử lại sau ít phút, hoặc xem toàn bộ mẫu của tiệm nhé.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Thử lại
        </button>
        <Link href="/#san-pham" className="btn btn-outline">
          Xem tất cả mẫu
        </Link>
      </div>
    </div>
  );
}
