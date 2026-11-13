'use client';

import { useEffect, useId, useRef } from 'react';
import { congNgay, datNgayThue, homNay, useNgayThue } from '@/lib/ngay-thue';

/**
 * Hai ô chọn Ngày nhận / Ngày trả (13/11/2026). Chỉ để ghi vào tin nhắn gửi
 * tiệm — web không kiểm tra lịch trống (chủ shop không muốn công khai lịch).
 *
 * Chọn ngày nhận thì ngày trả tự điền theo số ngày thuê (1 ngày -> hôm sau;
 * 3 ngày -> nhận · mặc · trả = nhận + 2), khách vẫn sửa lại được.
 */
export function ChonNgayThue({ soNgay, className = '' }: { soNgay: 1 | 3; className?: string }) {
  const id = useId();
  const ngay = useNgayThue();
  const lech = soNgay === 3 ? 2 : 1;

  // Đổi 1 ngày <-> 3 ngày khi đã có ngày nhận: tính lại ngày trả cho khớp.
  const soNgayTruoc = useRef(soNgay);
  useEffect(() => {
    if (soNgayTruoc.current !== soNgay && ngay.nhan) {
      datNgayThue({ nhan: ngay.nhan, tra: congNgay(ngay.nhan, lech) });
    }
    soNgayTruoc.current = soNgay;
  }, [soNgay, lech, ngay.nhan]);

  const o =
    'mt-1 h-12 w-full min-w-0 rounded-xl bg-surface px-3 text-[15px] text-ink ring-1 ring-inset ring-hairline focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <div className={`grid max-w-md grid-cols-2 gap-2.5 ${className}`}>
      <label htmlFor={`${id}-nhan`} className="text-xs font-semibold text-muted">
        Ngày nhận
        <input
          id={`${id}-nhan`}
          type="date"
          min={homNay()}
          value={ngay.nhan}
          onChange={(e) => {
            const nhan = e.target.value;
            datNgayThue({ nhan, tra: nhan ? congNgay(nhan, lech) : '' });
          }}
          className={o}
        />
      </label>
      <label htmlFor={`${id}-tra`} className="text-xs font-semibold text-muted">
        Ngày trả
        <input
          id={`${id}-tra`}
          type="date"
          min={ngay.nhan ? congNgay(ngay.nhan, 1) : homNay()}
          value={ngay.tra}
          onChange={(e) => datNgayThue({ nhan: ngay.nhan, tra: e.target.value })}
          className={o}
        />
      </label>
    </div>
  );
}
