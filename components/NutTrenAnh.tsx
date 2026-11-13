'use client';

import { useRouter } from 'next/navigation';
import { thongBao } from '@/lib/hieu-ung';

/**
 * Hai nút tròn đè lên góc trên ảnh mẫu (chỉ điện thoại, theo bản demo
 * 13/11/2026): ← quay lại và Chia sẻ.
 *
 * Quay lại: có lịch sử trong web thì lùi trang (giữ nguyên chỗ khách đang
 * cuộn ở danh sách); vào thẳng từ link ngoài thì về danh sách cùng loại.
 * Chia sẻ: bảng chia sẻ của máy (Zalo, Messenger…); máy không hỗ trợ thì chép
 * link.
 */
export function NutTrenAnh({ ten, veDanhSach }: { ten: string; veDanhSach: string }) {
  const router = useRouter();

  const quayLai = () => {
    const tuTrongWeb = document.referrer && new URL(document.referrer).origin === location.origin;
    if (tuTrongWeb && history.length > 1) router.back();
    else router.push(veDanhSach);
  };

  const chiaSe = async () => {
    const url = location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: ten, url });
      } catch {
        // Khách đóng bảng chia sẻ — không làm gì.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      thongBao({ noiDung: 'Đã chép link mẫu' });
    } catch {
      // Trình duyệt chặn bộ nhớ tạm — bỏ qua.
    }
  };

  const nut =
    'nhan-co flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_2px_10px_rgba(0,0,0,0.15)] backdrop-blur';

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-between sm:hidden">
      <button type="button" onClick={quayLai} aria-label="Quay lại" className={`pointer-events-auto ${nut}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button type="button" onClick={chiaSe} aria-label="Chia sẻ mẫu" className={`pointer-events-auto ${nut}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12M7 8l5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
        </svg>
      </button>
    </div>
  );
}
