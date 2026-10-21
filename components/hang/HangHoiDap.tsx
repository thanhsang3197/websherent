'use client';

import { useId, useState } from 'react';

export interface PhieuHoiDap {
  /** Chữ trên tab, một–hai từ. */
  tab: string;
  hoi: string;
  dap: string;
  /** Màu nền phiếu. */
  nen: string;
}

/**
 * Hỏi đáp dạng xấp phiếu có tab, như phiếu ghi trong ngăn kéo quầy: mỗi phiếu
 * đè lên phiếu trên, tab lệch dần sang phải. Một phiếu mở một lúc, phiếu đầu
 * mở sẵn. Mở/đóng chạy bằng grid-rows nên chiều cao giãn mượt.
 */
export function HangHoiDap({ phieu }: { phieu: PhieuHoiDap[] }) {
  const [mo, setMo] = useState(0);
  const goc = useId();

  return (
    <ol className="list-none">
      {phieu.map((p, i) => {
        const dangMo = mo === i;
        const idDap = `${goc}-dap-${i}`;
        return (
          <li
            key={p.hoi}
            className={`relative ${i > 0 ? '-mt-3' : ''}`}
            style={{ zIndex: i + 1 }}
            data-reveal
          >
            {/* Tab: cùng màu với thân phiếu nên tab + thân đọc thành một hình. */}
            <span
              aria-hidden="true"
              // Tab lệch dần sang phải, nhưng bước lệch co lại để tab cuối không
              // bao giờ vượt mép phải (% của margin tính theo bề ngang khung).
              className="block h-10 w-[7.5rem] rounded-t-xl px-4 pt-2.5 text-base font-medium text-ink [margin-left:calc(var(--i)*min(3rem,(100%-7.5rem)/var(--n)))] sm:w-[12.5rem] sm:[margin-left:calc(var(--i)*min(9.375rem,(100%-12.5rem)/var(--n)))]"
              style={{ backgroundColor: p.nen, ['--i' as string]: i, ['--n' as string]: Math.max(phieu.length - 1, 1) }}
            >
              {p.tab}
            </span>
            <div className="rounded-b-2xl rounded-tr-2xl" style={{ backgroundColor: p.nen }}>
              <h3 className="font-sans">
                <button
                  type="button"
                  onClick={() => setMo(dangMo ? -1 : i)}
                  aria-expanded={dangMo}
                  aria-controls={idDap}
                  className="flex w-full items-center justify-between gap-4 px-5 pb-5 pt-3 text-left text-xl font-medium text-ink sm:px-8"
                >
                  <span>{p.hoi}</span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-2xl leading-none transition-transform duration-300 ${dangMo ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={idDap}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                  dangMo ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[50ch] px-5 pb-8 text-[17px] leading-relaxed text-ink sm:px-8">
                    {p.dap}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
