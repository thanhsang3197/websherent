'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SU_KIEN_THONG_BAO, type ThongBaoChiTiet } from '@/lib/hieu-ung';

const HIEN_MS = 2600;

/**
 * Thông báo nhỏ trồi lên đáy màn hình (gắn MỘT lần trong app/layout.tsx).
 * Điện thoại nằm trên thanh điều hướng dưới đáy. Mỗi thông báo mới thay cái cũ
 * và chạy lại hiệu ứng (key tăng dần).
 */
export function ThongBao() {
  const [tb, setTb] = useState<(ThongBaoChiTiet & { key: number }) | null>(null);
  const hen = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const nhan = (e: Event) => {
      const chiTiet = (e as CustomEvent<ThongBaoChiTiet>).detail;
      setTb({ ...chiTiet, key: Date.now() });
      clearTimeout(hen.current);
      hen.current = setTimeout(() => setTb(null), HIEN_MS);
    };
    window.addEventListener(SU_KIEN_THONG_BAO, nhan);
    return () => {
      window.removeEventListener(SU_KIEN_THONG_BAO, nhan);
      clearTimeout(hen.current);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[65] md:bottom-6">
      {tb && (
        <div
          key={tb.key}
          className="toast-vao pointer-events-auto absolute left-1/2 flex w-max max-w-[calc(100vw-32px)] items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-glass-lg"
        >
          <span>{tb.noiDung}</span>
          {tb.link && (
            <Link href={tb.link.href} className="font-bold text-amber-200 underline-offset-4 hover:underline">
              {tb.link.nhan}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
