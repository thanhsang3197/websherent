'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatVnd } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import {
  capNhatMon,
  doiTrangThai,
  PHAN_TRAM_GIAM,
  SO_MAU_GIAM,
  tamTinh,
  useTuiDo,
  type MonTrongTui,
} from '@/lib/tui-do';
import { moLienHe } from '@/components/LienHeSheet';
import { hieuUngThemVaoTui } from '@/lib/hieu-ung-tui';
import { dongNgayTinNhan, useNgayThue } from '@/lib/ngay-thue';
import { ChonNgayThue } from '@/components/ChonNgayThue';

/**
 * Khối giá + hành động trên trang chi tiết, theo bản demo chủ shop duyệt
 * 13/11/2026:
 *  - Hai ô chọn "Thuê 1 ngày" / "Thuê 3 ngày". Lựa chọn ĐI THEO vào túi đồ và
 *    tin nhắn gửi tiệm (chủ shop chốt). Mẫu chưa nhập giá 1 ngày -> chỉ một ô.
 *  - Dòng cọc (hoàn lại), giá tag nếu có, dòng nhắc ưu đãi 3 váy.
 *  - Máy tính: hai nút "Thêm vào túi" / "Nhắn giữ mẫu" ngay trong trang.
 *    Điện thoại: hai nút đó nằm trên THANH DÍNH ĐÁY (thay thanh điều hướng
 *    chung — ThanhDuoi tự ẩn ở trang chi tiết).
 */
export function ChiTietThue({
  mon,
  gia1Ngay,
  gia3Ngay,
  coc,
  giaTag,
}: {
  /** Món gốc (tên, mã, ảnh…); giá + số ngày sẽ lấy theo ô khách chọn. */
  mon: MonTrongTui;
  gia1Ngay: number | null;
  gia3Ngay: number;
  coc: number;
  giaTag: number | null;
}) {
  const tui = useTuiDo();
  const ngay = useNgayThue();
  const trongTui = tui.find((m) => m.id === mon.id);
  const co1Ngay = gia1Ngay != null;
  const [chon, setChon] = useState<1 | 3>(co1Ngay ? 1 : 3);
  // Mẫu đã trong túi -> ô đang chọn bám theo số ngày lưu trong túi (khách quay
  // lại trang vẫn thấy đúng lựa chọn cũ). Mẫu không có giá 1 ngày thì luôn 3.
  const soNgay: 1 | 3 = !co1Ngay ? 3 : trongTui ? trongTui.days : chon;
  const theoNgay = (d: 1 | 3): MonTrongTui => ({
    ...mon,
    days: d,
    price: d === 1 && gia1Ngay != null ? gia1Ngay : gia3Ngay,
  });
  const monChon = theoNgay(soNgay);
  const { conThieu, soMauTinh } = tamTinh(tui);
  const loiHon = co1Ngay && gia3Ngay > 0 && gia3Ngay < gia1Ngay * 3;

  const doiNgay = (d: 1 | 3) => {
    setChon(d);
    // Đã trong túi -> cập nhật luôn số ngày + giá trong túi.
    if (trongTui) capNhatMon(theoNgay(d));
  };

  const tinNhan =
    `Chào ${siteConfig.name}, mình muốn hỏi mẫu ${mon.name} (mã ${mon.id})` +
    `${mon.size ? `, size ${mon.size}` : ''}, thuê ${soNgay} ngày.\n${dongNgayTinNhan(ngay)}`;

  const bamTui = (el: HTMLElement) => {
    const them = !trongTui;
    doiTrangThai(monChon);
    if (them) hieuUngThemVaoTui(el, monChon, tui);
  };
  const nhanTiem = () => moLienHe({ tinNhan, viTri: 'chi-tiet', maSp: mon.id });

  const o = (on: boolean) =>
    `nhan-co relative flex h-[76px] flex-col items-start justify-center gap-0.5 rounded-2xl px-4 text-left transition-colors ${
      on ? 'bg-tint text-accent-dark ring-2 ring-inset ring-accent' : 'bg-surface text-ink ring-1 ring-inset ring-hairline hover:ring-accent/50'
    }`;

  return (
    <>
      {/* Chọn số ngày thuê */}
      <div className={`mt-5 grid gap-2.5 ${co1Ngay ? 'grid-cols-2' : 'grid-cols-1'} max-w-md`} role="radiogroup" aria-label="Chọn số ngày thuê">
        {co1Ngay && (
          <button type="button" role="radio" aria-checked={soNgay === 1} onClick={() => doiNgay(1)} className={o(soNgay === 1)}>
            <span className="text-xs font-semibold">Thuê 1 ngày</span>
            <span className="text-xl font-extrabold">{formatVnd(gia1Ngay)}</span>
          </button>
        )}
        <button type="button" role="radio" aria-checked={soNgay === 3} onClick={() => doiNgay(3)} className={o(soNgay === 3)}>
          <span className="text-xs font-semibold">Thuê 3 ngày</span>
          <span className="text-xl font-extrabold">{formatVnd(gia3Ngay)}</span>
          {loiHon && (
            <span className="absolute -top-2.5 right-3 rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">
              Lời hơn
            </span>
          )}
        </button>
      </div>

      {/* Ngày nhận / trả — chỉ ghi vào tin nhắn, không kiểm tra lịch trống. */}
      <ChonNgayThue soNgay={soNgay} className="mt-3" />

      <dl className="mt-3 max-w-md divide-y divide-hairline rounded-2xl bg-surface px-4 text-sm ring-1 ring-inset ring-hairline">
        <div className="flex items-center justify-between gap-3 py-3">
          <dt className="text-muted">Cọc (hoàn lại khi trả đồ đúng hẹn, nguyên vẹn)</dt>
          <dd className="shrink-0 font-bold text-ink">{formatVnd(coc)}</dd>
        </div>
        {giaTag != null && (
          <div className="flex items-center justify-between gap-3 py-3">
            <dt className="text-muted">Giá tag</dt>
            <dd className="shrink-0 font-bold text-ink">{formatVnd(giaTag)}</dd>
          </div>
        )}
      </dl>

      {/* Máy tính / tablet: nút ngay trong trang. */}
      <div className="mt-5 hidden max-w-md grid-cols-2 gap-2 md:grid">
        <NutThemTui trongTui={!!trongTui} onBam={bamTui} />
        <button type="button" onClick={nhanTiem} className="btn btn-primary !px-3">
          <IconChat />
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

      {/* Điện thoại: thanh hành động dính đáy (thay thanh điều hướng chung). */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(64px+env(safe-area-inset-bottom))] items-start gap-2 border-t border-hairline bg-surface/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_20px_rgba(30,26,27,0.08)] backdrop-blur md:hidden">
        <Link
          href="/tui-do"
          aria-label={`Túi đồ muốn thuê, ${tui.length} món`}
          className="nhan-co relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tint text-accent-dark"
        >
          <span className="relative" data-dich-tui>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 8h14l-1.2 12H6.2z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            {tui.length > 0 && (
              <span key={tui.length} className="huy-hieu-nay absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white">
                {tui.length}
              </span>
            )}
          </span>
        </Link>
        <NutThemTui trongTui={!!trongTui} onBam={bamTui} className="h-12 min-w-0 flex-1 gap-1.5 whitespace-nowrap !px-2 text-sm" />
        <button type="button" onClick={nhanTiem} className="btn btn-primary h-12 min-w-0 flex-1 whitespace-nowrap !px-2 text-sm">
          Nhắn giữ mẫu
        </button>
      </div>
    </>
  );
}

function NutThemTui({
  trongTui,
  onBam,
  className = '',
}: {
  trongTui: boolean;
  onBam: (el: HTMLElement) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onBam(e.currentTarget)}
      aria-pressed={trongTui}
      className={`btn ${trongTui ? 'bg-tint text-accent-dark ring-1 ring-inset ring-accent/40' : 'btn-outline'} !px-3 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={trongTui ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
      {trongTui ? 'Đã trong túi' : 'Thêm vào túi'}
    </button>
  );
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  );
}
