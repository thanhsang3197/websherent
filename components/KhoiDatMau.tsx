'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import {
  doiTrangThai,
  PHAN_TRAM_GIAM,
  SO_MAU_GIAM,
  tamTinh,
  useTuiDo,
  type MonTrongTui,
} from '@/lib/tui-do';
import { moLienHe } from '@/components/LienHeSheet';
import { hieuUngThemVaoTui } from '@/lib/hieu-ung-tui';

/**
 * Cụm hành động trên trang chi tiết (13/11/2026): "Thêm vào túi" + "Nhắn giữ
 * mẫu" (mở bảng chọn Zalo / Messenger / Gọi, tin nhắn soạn sẵn tên + mã mẫu),
 * kèm dòng nhắc ưu đãi thuê từ 3 váy.
 */
export function KhoiDatMau({ mon }: { mon: MonTrongTui }) {
  const tui = useTuiDo();
  const co = tui.some((m) => m.id === mon.id);
  const { conThieu, soMauTinh } = tamTinh(tui);

  const tinNhan =
    `Chào ${siteConfig.name}, mình muốn hỏi mẫu ${mon.name} (mã ${mon.id})` +
    `${mon.size ? `, size ${mon.size}` : ''}.\nNgày mặc: ...`;

  return (
    <div className="mt-6">
      <div className="grid max-w-md grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            const them = !co;
            doiTrangThai(mon);
            if (them) {
              hieuUngThemVaoTui(e.currentTarget, mon, tui);
            }
          }}
          aria-pressed={co}
          className={`btn ${co ? 'bg-tint text-accent-dark ring-1 ring-inset ring-accent/40' : 'btn-outline'} !px-3`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={co ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {co ? 'Đã trong túi' : 'Thêm vào túi'}
        </button>
        <button
          type="button"
          onClick={() => moLienHe({ tinNhan, viTri: 'chi-tiet', maSp: mon.id })}
          className="btn btn-primary !px-3"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
          Nhắn giữ mẫu
        </button>
      </div>

      <div className="mt-3 flex max-w-md items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white">
        <p className="flex-1 leading-snug">
          {conThieu > 0 ? (
            <>
              <b className="text-amber-200">Thuê từ {SO_MAU_GIAM} váy giảm {PHAN_TRAM_GIAM}%</b>
              {soMauTinh > 0 ? ` — thêm ${conThieu} mẫu nữa là đủ` : ' — gom mẫu vào túi để tự tính'}
            </>
          ) : (
            <b className="text-amber-200">Túi đã đủ {SO_MAU_GIAM} mẫu — được giảm {PHAN_TRAM_GIAM}%!</b>
          )}
        </p>
        <Link href="/tui-do" className="shrink-0 font-bold underline underline-offset-4">
          Xem túi{tui.length > 0 ? ` (${tui.length})` : ''}
        </Link>
      </div>
    </div>
  );
}
