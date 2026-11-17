'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { formatVnd, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { bamQuaAoDai, doiQuaAoDai, doiTrangThai } from '@/lib/tui-do';
import {
  KET_THUC,
  MOC_AO_DAI,
  TEN_NHOM,
  tinhUuDaiAoDai,
  type PhuKienQua,
} from '@/lib/uu-dai-ao-dai';
import { IconQua } from '@/components/GioMuaThanhLy';
import { DaiCuonNgang } from '@/components/DaiCuonNgang';

const k = (n: number) => `${n / 1000}K`;
const ngayKetThuc = KET_THUC.split('-').reverse().slice(0, 2).join('/');

/**
 * Khối ưu đãi áo dài trong túi đồ: thanh 3 mốc (150K / 200K / 300K tiền thuê
 * áo dài) và bộ chọn phụ kiện quà. Chưa đủ mốc thì hé lộ vài món quà để khách
 * thấy được gì; đủ mốc thì chạm để chọn (bấm lại để bỏ, quá số quà thì đổi món).
 */
export function UuDaiAoDaiTui({
  uuDai,
  phuKien,
  daChon,
  trongTui,
}: {
  uuDai: ReturnType<typeof tinhUuDaiAoDai>;
  phuKien: PhuKienQua[];
  daChon: PhuKienQua[];
  trongTui: Set<string>;
}) {
  const { bill, moc, mocKe } = uuDai;

  // Phụ kiện được chọn ở mốc hiện tại (bỏ món đã nằm trong túi).
  const duocChon = useMemo(
    () => (moc ? phuKien.filter((p) => !trongTui.has(p.id) && (moc.kieu === 'bat-ky' || p.nho)) : []),
    [phuKien, moc, trongTui],
  );
  const cacNhom = useMemo(() => Array.from(new Set(duocChon.map((p) => p.nhom))), [duocChon]);
  const [nhom, setNhom] = useState<string | null>(null);
  const nhomDang = nhom && cacNhom.includes(nhom) ? nhom : (cacNhom[0] ?? null);
  const hienThi = duocChon.filter((p) => p.nhom === nhomDang);

  // Chưa đủ mốc: mỗi nhóm quà nhỏ một ảnh, để khách thấy quà trông thế nào.
  const xemTruoc = useMemo(() => {
    if (moc) return [];
    const daCo = new Set<string>();
    return phuKien.filter((p) => p.nho && !daCo.has(p.nhom) && daCo.add(p.nhom));
  }, [phuKien, moc]);

  const idChon = daChon.map((p) => p.id);
  const idHopLe = duocChon.map((p) => p.id);
  // Đã chọn đủ quà mà bấm thêm món khác -> hỏi khách: đổi quà hay thuê thêm
  // (trả tiền + cọc như thường). Chủ shop chốt 17/11/2026.
  const [hoi, setHoi] = useState<PhuKienQua | null>(null);
  const bamMon = (p: PhuKienQua) => {
    if (moc && !idChon.includes(p.id) && daChon.length >= moc.soQua) setHoi(p);
    else if (moc) bamQuaAoDai(p.id, moc.soQua, idHopLe);
  };

  return (
    <section
      aria-labelledby="uu-dai-ao-dai"
      className={`mt-4 rounded-2xl p-4 transition-colors duration-500 ${moc ? 'bg-accent/10' : 'bg-tint/70'}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-dark">
        Ưu đãi áo dài · đến {ngayKetThuc}
      </p>
      <h2 id="uu-dai-ao-dai" className="mt-1 flex items-start gap-2 text-[15px] font-bold leading-snug text-ink">
        <IconQua />
        <span>
          {moc ? (
            <>Bạn được tặng {moc.moTa}</>
          ) : (
            <>
              Thuê áo dài từ {k(mocKe!.tren)} để được tặng {mocKe!.moTa}
            </>
          )}
        </span>
      </h2>
      <p className="mt-1 pl-[26px] text-sm text-ink/75">
        Tiền thuê áo dài trong túi: <b className="font-semibold text-ink">{formatVnd(bill)}</b>
        {moc && mocKe && <> · từ {k(mocKe.tren)} được nâng lên {mocKe.moTa}</>}
      </p>

      <ThanhMoc bill={bill} />

      {moc ? (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-semibold text-ink/80">Chạm để chọn quà</p>
            <p className="text-[13px] font-semibold tabular-nums text-accent-dark">
              Đã chọn {daChon.length}/{moc.soQua}
            </p>
          </div>

          {cacNhom.length > 1 && (
            <ul className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Nhóm phụ kiện">
              {cacNhom.map((n) => {
                const dang = n === nhomDang;
                const soChon = daChon.filter((p) => p.nhom === n).length;
                return (
                  <li key={n} className="shrink-0">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={dang}
                      onClick={() => setNhom(n)}
                      className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition ${
                        dang ? 'bg-ink text-surface' : 'bg-surface text-ink ring-1 ring-inset ring-hairline hover:ring-accent/50'
                      }`}
                    >
                      {TEN_NHOM[n] ?? n.toUpperCase()}
                      {soChon > 0 && (
                        <span className={`h-1.5 w-1.5 rounded-full ${dang ? 'bg-accent' : 'bg-accent-dark'}`} aria-label="có món đã chọn" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <DaiCuonNgang key={nhomDang} className="no-scrollbar -mx-4 mt-3 flex gap-2.5 overflow-x-auto scroll-smooth px-4 pb-1">
            {hienThi.map((p) => {
              const chon = idChon.includes(p.id);
              return (
                <li key={p.id} className="w-[84px] shrink-0">
                  <button
                    type="button"
                    onClick={() => bamMon(p)}
                    aria-pressed={chon}
                    aria-label={`${chon ? 'Bỏ chọn' : 'Chọn'} ${p.name} làm quà`}
                    className="block w-full text-left"
                  >
                    <span
                      className={`relative block aspect-square overflow-hidden rounded-xl bg-surface ring-2 transition ${
                        chon ? 'ring-accent' : 'ring-transparent hover:ring-accent/40'
                      }`}
                    >
                      <Image src={p.image} alt="" fill sizes="84px" placeholder="blur" blurDataURL={GLASS_BLUR_DATA_URL} className="object-cover" />
                      {chon && <DauChon />}
                    </span>
                    <span className="mt-1 block text-[12px] font-medium leading-tight text-ink">{p.name}</span>
                    <span className="block text-[11px] text-ink/55">
                      <s>{k(p.price)}</s> <span className="font-semibold text-accent-dark">Miễn phí</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </DaiCuonNgang>
          {daChon.length === 0 && (
            <p className="mt-2 text-xs text-ink/60">Chưa chọn cũng được — tiệm sẽ tư vấn khi bạn tới thử đồ.</p>
          )}
        </div>
      ) : (
        xemTruoc.length > 0 && (
          <div className="mt-4">
            <p className="text-[13px] font-semibold text-ink/70">Quà bạn có thể chọn khi đủ {k(MOC_AO_DAI[0].tren)}</p>
            <ul className="mt-2 flex gap-2" aria-hidden="true">
              {xemTruoc.map((p) => (
                <li key={p.id} className="relative aspect-square w-12 overflow-hidden rounded-lg bg-surface opacity-70 grayscale-[35%] sm:w-14">
                  <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-ink/60">
              {xemTruoc.map((p) => TEN_NHOM[p.nhom] ?? p.nhom).join(' · ')}
            </p>
          </div>
        )
      )}

      {hoi && (
        <HoiThemPhuKien
          mon={hoi}
          daChon={daChon}
          onDoi={(cu) => {
            doiQuaAoDai(cu, hoi.id, idHopLe);
            setHoi(null);
          }}
          onThue={() => {
            doiTrangThai(hoi.mon);
            setHoi(null);
          }}
          onDong={() => setHoi(null)}
        />
      )}
    </section>
  );
}

/** Hộp hỏi khi đã đủ quà: đổi 1 món quà lấy món này, hoặc thuê thêm (trả tiền). */
function HoiThemPhuKien({
  mon,
  daChon,
  onDoi,
  onThue,
  onDong,
}: {
  mon: PhuKienQua;
  daChon: PhuKienQua[];
  onDoi: (cu: string) => void;
  onThue: () => void;
  onDong: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center" onClick={onDong}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hoi-them-pk"
        className="w-full max-w-sm rounded-3xl bg-surface p-5 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-tint">
            <Image src={mon.image} alt="" fill sizes="56px" className="object-cover" />
          </span>
          <div className="min-w-0">
            <p id="hoi-them-pk" className="font-bold text-ink">{mon.name}</p>
            <p className="text-sm text-muted">Bạn đã chọn đủ {daChon.length} món quà miễn phí.</p>
          </div>
        </div>

        <p className="mt-4 text-[13px] font-semibold text-ink/80">Đổi quà — lấy món này thay cho:</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {daChon.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onDoi(q.id)}
              className="nhan-co flex items-center gap-2 rounded-xl bg-tint/60 p-1.5 text-left text-sm font-semibold text-ink ring-1 ring-inset ring-hairline hover:ring-accent/50"
            >
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image src={q.image} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="line-clamp-1">{q.name}</span>
            </button>
          ))}
        </div>

        <button type="button" onClick={onThue} className="btn btn-primary mt-4 w-full">
          Thuê thêm · {formatVnd(mon.mon.price)}
          {mon.mon.deposit > 0 && <span className="font-normal opacity-80"> + cọc {formatVnd(mon.mon.deposit)}</span>}
        </button>
        <button type="button" onClick={onDong} className="mt-2 h-10 w-full text-sm text-muted hover:text-ink">
          Huỷ
        </button>
      </div>
    </div>
  );
}

/** Thanh 3 đoạn bằng nhau: 0→150K, 150K→200K, 200K→300K; mỗi đoạn tự đầy theo bill. */
function ThanhMoc({ bill }: { bill: number }) {
  return (
    <div className="mt-3" role="img" aria-label={`Tiền thuê áo dài ${formatVnd(bill)}`}>
      <div className="grid grid-cols-3 gap-1">
        {MOC_AO_DAI.map((m, i) => {
          const tu = i === 0 ? 0 : MOC_AO_DAI[i - 1].tren;
          const dat = bill >= m.tren;
          const phan = dat ? 100 : Math.max(0, Math.min(100, ((bill - tu) / (m.tren - tu)) * 100));
          return (
            <div key={m.tren} className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div
                className={`h-full rounded-full transition-[width,background-color] duration-500 ease-out ${dat ? 'bg-accent-dark' : 'bg-accent'}`}
                style={{ width: `${phan}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1 text-right">
        {MOC_AO_DAI.map((m) => {
          const dat = bill >= m.tren;
          return (
            <div key={m.tren} className="leading-tight">
              <p className={`text-[12px] font-bold ${dat ? 'text-accent-dark' : 'text-ink/60'}`}>
                {dat && '✓ '}
                {k(m.tren)}
              </p>
              <p className="text-[11px] text-ink/55">
                {m.soQua} PK {m.kieu === 'nho' ? '≤20K' : 'bất kỳ'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DauChon() {
  return (
    <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}
