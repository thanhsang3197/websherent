'use client';

import { useEffect, useRef } from 'react';

/** Phải bằng thời lượng animation `.nhan-lap-lanh` trong globals.css. */
const NHIP_MS = 3500;

/**
 * Nhãn HOT / NEW lấp lánh trên ảnh (chủ shop 15/10/2026) — khơi tò mò để
 * khách bấm vào xem, nhắn hỏi.
 *
 * Đặt GÓC DƯỚI-TRÁI: khung ảnh hình vòm (`.arch`) bo rất sâu ở hai góc trên,
 * nhãn đặt góc trên bị cắt mất nửa; góc dưới chỉ bo 6px và không che mặt mẫu.
 * HOT đứng trước NEW: "được thuê nhiều" là lý do mạnh hơn "mới về".
 *
 * MỌI nhãn trên trang loé CÙNG MỘT LÚC (chủ shop yêu cầu 15/10/2026). Animation
 * CSS tính giờ từ lúc phần tử xuất hiện, nên thẻ hiện ra sau (bấm "Xem thêm",
 * đổi bộ lọc, băng chạy) sẽ lệch nhịp với thẻ có sẵn. Cách chữa: lùi điểm bắt
 * đầu của mỗi nhãn về đúng mốc chung của trang — delay âm bằng phần dư của
 * đồng hồ trang chia cho một nhịp. Giá trị đi qua biến `--nhan-tre`.
 */
export function NhanNoiBat({ hot, isNew }: { hot?: boolean; isNew?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = Number(document.timeline?.currentTime ?? performance.now());
    ref.current?.style.setProperty('--nhan-tre', `-${Math.round(now % NHIP_MS)}ms`);
  }, []);

  if (!hot && !isNew) return null;
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-2 left-2 flex gap-1 sm:bottom-2.5 sm:left-2.5"
    >
      {hot && (
        <span className="nhan-lap-lanh rounded-full bg-gradient-to-r from-[#c2412d] to-[#e8774a] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-md sm:text-[11px]">
          🔥 HOT
        </span>
      )}
      {isNew && (
        <span className="nhan-lap-lanh rounded-full bg-gradient-to-r from-accent to-accent-dark px-2 py-0.5 text-[10px] font-bold tracking-wider text-surface shadow-md sm:text-[11px]">
          ✨ NEW
        </span>
      )}
    </div>
  );
}
