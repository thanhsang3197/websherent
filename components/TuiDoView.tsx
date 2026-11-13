'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { formatVnd, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import {
  boKhoiTui,
  PHAN_TRAM_GIAM,
  SO_MAU_GIAM,
  tamTinh,
  useTuiDo,
  xoaHetTui,
  type MonTrongTui,
} from '@/lib/tui-do';
import { moLienHe } from '@/components/LienHeSheet';
import { ChonNgayThue } from '@/components/ChonNgayThue';
import { dongNgayTinNhan, useNgayThue, type NgayThue } from '@/lib/ngay-thue';

/** Đã chạy trên máy khách chưa — tránh nháy "túi rỗng" trước khi đọc localStorage. */
const daGanKet = () => true;
const chuaGanKet = () => false;
const khongDangKy = () => () => {};

function soanTinNhan(list: MonTrongTui[], ngay: NgayThue) {
  const t = tamTinh(list);
  const dong = list.map(
    (m, i) =>
      `${i + 1}. ${m.name} (mã ${m.id})${m.size ? ` · size ${m.size}` : ''} – ${formatVnd(m.price)}/${m.days} ngày`,
  );
  return [
    `Chào ${siteConfig.name}, mình muốn thuê ${list.length} món:`,
    ...dong,
    dongNgayTinNhan(ngay),
    `Tạm tính phí thuê: ${formatVnd(t.phiThue - t.giam)}${t.duGiam ? ` (đã trừ ưu đãi ${PHAN_TRAM_GIAM}%)` : ''}`,
  ].join('\n');
}

export function TuiDoView() {
  const list = useTuiDo();
  const daSan = useSyncExternalStore(khongDangKy, daGanKet, chuaGanKet);
  const ngay = useNgayThue();
  const t = tamTinh(list);
  // Gợi ý ngày trả theo món thuê lâu nhất trong túi.
  const soNgayGoiY: 1 | 3 = list.some((m) => m.days === 3) ? 3 : 1;

  // Pháo nhỏ đúng lúc túi VỪA đủ mốc (chưa đủ -> đủ), không bắn khi mở trang
  // mà túi đã đủ sẵn.
  const [mung, setMung] = useState(0);
  const duTruoc = useRef<boolean | null>(null);
  useEffect(() => {
    if (!daSan) return;
    if (duTruoc.current === false && t.duGiam) setMung((k) => k + 1);
    duTruoc.current = t.duGiam;
  }, [daSan, t.duGiam]);

  if (!daSan) {
    return <div className="h-64" aria-busy="true" />;
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-surface p-8 text-center shadow-glass">
        <p className="text-lg font-bold text-ink">Túi đồ đang trống</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Bấm ♡ trên ảnh mẫu bạn thích để gom vào đây. Thuê từ {SO_MAU_GIAM} mẫu được giảm{' '}
          {PHAN_TRAM_GIAM}% tổng đơn — gửi cả danh sách cho tiệm chỉ với một tin nhắn.
        </p>
        <Link href="/#san-pham" className="btn btn-primary mt-6">
          Xem mẫu váy
        </Link>
      </div>
    );
  }

  const phanTram = Math.min(100, Math.round((t.soMauTinh / SO_MAU_GIAM) * 100));
  const tinNhan = soanTinNhan(list, ngay);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div>
        {/* Thanh tiến độ tới mốc ưu đãi */}
        <div
          className={`relative rounded-2xl p-4 transition-colors duration-500 ${t.duGiam ? 'bg-emerald-50' : 'bg-amber-100'}`}
        >
          {mung > 0 && <PhaoMung key={mung} />}
          <p className="text-sm font-bold text-ink">
            {t.duGiam
              ? `Đã đủ ${SO_MAU_GIAM} mẫu — bạn được giảm ${PHAN_TRAM_GIAM}%!`
              : `Thêm ${t.conThieu} mẫu nữa để được giảm ${PHAN_TRAM_GIAM}% tổng đơn`}
          </p>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-500 ease-out ${t.duGiam ? 'bg-emerald-500' : 'bg-accent'}`}
              style={{ width: `${phanTram}%` }}
            />
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-3">
          {list.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-surface p-2.5 shadow-glass">
              <Link href={`/san-pham/${m.slug}`} className="arch relative h-24 w-[72px] shrink-0 overflow-hidden bg-tint">
                {m.image && (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="72px"
                    placeholder="blur"
                    blurDataURL={GLASS_BLUR_DATA_URL}
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/san-pham/${m.slug}`} className="line-clamp-1 font-bold text-ink hover:text-accent-dark">
                  {m.name}
                </Link>
                <p className="line-clamp-1 text-xs text-muted">
                  {[m.brand, m.size].filter(Boolean).join(' · ') || ' '}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-extrabold text-accent-dark">{formatVnd(m.price)}</span>
                  <span className="text-xs text-muted"> /{m.days} ngày</span>
                  {m.deposit > 0 && <span className="text-xs text-muted"> · cọc {formatVnd(m.deposit)}</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => boKhoiTui(m.id)}
                aria-label={`Bỏ ${m.name} khỏi túi`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint/60 text-muted hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between">
          <Link href="/#san-pham" className="text-sm font-semibold text-accent-dark hover:underline">
            + Thêm mẫu khác
          </Link>
          <button type="button" onClick={xoaHetTui} className="h-10 text-sm text-muted hover:text-ink">
            Xoá hết
          </button>
        </div>
      </div>

      <aside className="rounded-3xl bg-surface p-5 shadow-glass lg:sticky lg:top-32">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Phí thuê ({list.length} món)</dt>
            <dd>{formatVnd(t.phiThue)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Ưu đãi từ {SO_MAU_GIAM} váy (−{PHAN_TRAM_GIAM}%)</dt>
            <dd className={t.duGiam ? 'font-bold text-emerald-700' : 'text-muted'}>
              {t.duGiam ? `−${formatVnd(t.giam)}` : 'chưa đủ mẫu'}
            </dd>
          </div>
          {t.coc > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Tiền cọc (hoàn lại)</dt>
              <dd>{formatVnd(t.coc)}</dd>
            </div>
          )}
        </dl>
        <div className="my-3 h-px bg-hairline" />
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-bold">Tạm tính phí thuê</span>
          <span className="text-2xl font-extrabold text-accent-dark">{formatVnd(t.phiThue - t.giam)}</span>
        </div>
        <p className="mt-1.5 text-xs text-muted">
          Giá theo mức hiện trên thẻ mẫu. Tiệm sẽ xác nhận giá và lịch trống khi bạn nhắn.
        </p>

        {/* Ngày nhận / trả — chỉ ghi vào tin nhắn, web không kiểm tra lịch trống. */}
        <ChonNgayThue soNgay={soNgayGoiY} className="mt-4" />

        <p className="mt-4 text-xs font-bold text-ink">Tin nhắn gửi tiệm</p>
        <p className="mt-1 whitespace-pre-line rounded-2xl bg-bg p-3 text-sm leading-relaxed text-ink ring-1 ring-inset ring-hairline">
          {tinNhan}
        </p>

        <button
          type="button"
          onClick={() => moLienHe({ tinNhan, viTri: 'tui-do', maSp: list.map((m) => m.id).join(',') })}
          className="btn btn-primary mt-4 w-full"
        >
          Gửi danh sách cho tiệm
        </button>
      </aside>
    </div>
  );
}

/** 14 chấm màu bung ra từ giữa thanh ưu đãi rồi mờ đi (~0,9 giây). */
const MAU_PHAO = ['#C92A62', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FBBF24', '#8B5CF6'];
function PhaoMung() {
  const cham = Array.from({ length: 14 }, (_, i) => {
    const goc = (i / 14) * Math.PI * 2;
    const xa = 50 + (i % 3) * 18;
    return {
      dx: `${Math.round(Math.cos(goc) * xa * 1.8)}px`,
      dy: `${Math.round(Math.sin(goc) * xa * 0.7)}px`,
      mau: MAU_PHAO[i % MAU_PHAO.length],
    };
  });
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
      {cham.map((c, i) => (
        <span
          key={i}
          className="phao-no absolute h-2 w-2 rounded-full"
          style={{ background: c.mau, ['--dx' as string]: c.dx, ['--dy' as string]: c.dy }}
        />
      ))}
    </div>
  );
}
