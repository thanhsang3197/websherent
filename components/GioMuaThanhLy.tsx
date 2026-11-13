'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types/product';
import { formatVndD, GLASS_BLUR_DATA_URL } from '@/lib/format';
import { siteConfig } from '@/lib/site-config';
import { giaFlash, PHAN_TRAM_FLASH } from '@/lib/flash-sale';
import { useMauFlash } from '@/lib/use-flash-sale';
import { giaThuc, monMuaTuSanPham, QUA_TANG, tinhGio, type GioMua, type MonMua } from '@/lib/gio-mua-mon';
import { boKhoiGio, chonQua, useGioMua, xoaHetGio } from '@/lib/gio-mua';
import { moLienHe } from '@/components/LienHeSheet';
import { phaoTai } from '@/lib/hieu-ung';

const k = (n: number) => `${n / 1000}k`;

function soanTinNhan(gio: GioMua, flash: Set<string>) {
  const t = tinhGio(gio, flash);
  const dong = gio.mon.map((m, i) => {
    const gia = giaThuc(m, flash);
    const giaChu =
      gia > 0
        ? flash.has(m.id)
          ? `${formatVndD(gia)} (flash sale −${PHAN_TRAM_FLASH}%, giá pass ${formatVndD(m.giaPass)})`
          : formatVndD(gia)
        : 'giá liên hệ';
    return `${i + 1}. ${m.name} (mã ${m.id})${m.size ? ` · size ${m.size}` : ''} – ${giaChu}`;
  });
  return [
    `Chào ${siteConfig.name}, mình muốn MUA ${gio.mon.length} mẫu thanh lý:`,
    ...dong,
    ...(t.qua ? [`Quà tặng (đơn từ ${k(t.moc!.don)}): ${t.qua.name} (mã ${t.qua.id})`] : []),
    `Tổng: ${formatVndD(t.tong)}${t.coMonLienHe ? ' + mẫu giá liên hệ' : ''} (chưa gồm phí ship)`,
  ].join('\n');
}

/**
 * Giỏ mua trên trang Thanh lý: thanh nổi đáy màn hình (tổng tiền + còn thiếu
 * bao nhiêu để được quà) và bảng giỏ chi tiết (bỏ mẫu, chọn quà, gửi tiệm qua
 * Zalo / Messenger / Gọi — dùng chung bảng LienHeSheet).
 *
 * `products`: toàn bộ mẫu đang pass — để biết mẫu nào đang flash sale và mẫu
 * nào đủ điều kiện làm quà.
 */
export function GioMuaThanhLy({ products }: { products: Product[] }) {
  const gio = useGioMua();
  const { ids: flash } = useMauFlash(products);
  const [mo, setMo] = useState(false);
  const dongBang = useCallback(() => setMo(false), []);
  const t = tinhGio(gio, flash);
  const thanhRef = useRef<HTMLButtonElement>(null);

  // Mẫu bán xong (đã rời trang thanh lý) thì tự bỏ khỏi giỏ.
  const conBan = useMemo(() => new Set(products.map((p) => p.id)), [products]);
  useEffect(() => {
    gio.mon.filter((m) => !conBan.has(m.id)).forEach((m) => boKhoiGio(m.id));
    if (gio.qua && !conBan.has(gio.qua.id)) chonQua(null);
  }, [gio, conBan]);

  // Pháo nhỏ trên thanh giỏ đúng lúc vừa đạt một mốc quà mới.
  const mocTruoc = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    const nay = t.moc?.don ?? null;
    if (mocTruoc.current !== undefined && nay !== null && (mocTruoc.current === null || nay > mocTruoc.current) && thanhRef.current) {
      phaoTai(thanhRef.current);
    }
    mocTruoc.current = nay;
  }, [t.moc]);

  // Thanh giỏ đang nổi -> đẩy thông báo nhỏ (components/ThongBao.tsx) lên trên nó.
  const coThanh = gio.mon.length > 0;
  useEffect(() => {
    if (!coThanh) return;
    document.documentElement.style.setProperty('--day-noi', '88px');
    return () => {
      document.documentElement.style.removeProperty('--day-noi');
    };
  }, [coThanh]);

  // Giỏ trống thì đóng bảng.
  useEffect(() => {
    if (gio.mon.length === 0) setMo(false);
  }, [gio.mon.length]);

  if (gio.mon.length === 0) return null;

  const mocCuoi = QUA_TANG[QUA_TANG.length - 1];
  const phanTram = mocCuoi ? Math.min(100, Math.round((t.tong / mocCuoi.don) * 100)) : 100;

  return (
    <>
      {/* Chừa chỗ cuối trang cho thanh nổi. */}
      <div aria-hidden="true" className="h-24" />

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 px-3 pb-2 md:bottom-0 md:pb-5">
        <button
          ref={thanhRef}
          type="button"
          onClick={() => setMo(true)}
          className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-2xl bg-ink p-3 pr-4 text-left text-surface shadow-[0_10px_30px_rgba(30,26,27,0.28)] transition active:scale-[0.99]"
          aria-haspopup="dialog"
        >
          <span data-dich-gio className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface/10">
            <IconGio />
            <span key={gio.mon.length} className="huy-hieu-nay absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-extrabold text-white">
              {gio.mon.length}
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-semibold">Giỏ mua · {formatVndD(t.tong)}</span>
              <span className="shrink-0 text-[13px] font-semibold text-accent">Xem giỏ →</span>
            </span>
            <span className="mt-0.5 block truncate text-[13px] text-surface/75">
              {t.mocKe
                ? `Thêm ${formatVndD(t.conThieu)} để được tặng mẫu ${k(t.mocKe.tang)}`
                : t.moc
                  ? t.qua
                    ? `Đã chọn quà: ${t.qua.name}`
                    : `Bạn được tặng 1 mẫu ${k(t.moc.tang)} — chọn quà ngay`
                  : `${gio.mon.length} mẫu`}
            </span>
            {QUA_TANG.length > 0 && (
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-surface/15">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                  style={{ width: `${phanTram}%` }}
                />
              </span>
            )}
          </span>
        </button>
      </div>

      {mo && <BangGio gio={gio} flash={flash} products={products} dong={dongBang} />}
    </>
  );
}

function BangGio({
  gio,
  flash,
  products,
  dong,
}: {
  gio: GioMua;
  flash: Set<string>;
  products: Product[];
  dong: () => void;
}) {
  const t = tinhGio(gio, flash);
  const dongRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dongRef.current?.focus();
    const phim = (e: KeyboardEvent) => e.key === 'Escape' && dong();
    window.addEventListener('keydown', phim);
    const cu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', phim);
      document.body.style.overflow = cu;
    };
  }, [dong]);

  // Mẫu được chọn làm quà: giá pass ≤ mức tặng, chưa nằm trong giỏ; rẻ nhất trước.
  const quaDuocChon = useMemo(() => {
    if (!t.moc) return [];
    const trongGio = new Set(gio.mon.map((m) => m.id));
    return products
      .filter((p) => p.image && (p.sale?.price ?? 0) > 0 && p.sale!.price <= t.moc!.tang && !trongGio.has(p.id))
      .sort((a, b) => b.sale!.price - a.sale!.price);
  }, [products, gio.mon, t.moc]);

  const tinNhan = soanTinNhan(gio, flash);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true" aria-labelledby="gio-mua-tieu-de">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={dong} aria-hidden="true" />
      <div className="relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-bg shadow-2xl md:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <h2 id="gio-mua-tieu-de" className="font-serif text-2xl text-ink">
            Giỏ mua thanh lý
          </h2>
          <button
            ref={dongRef}
            type="button"
            onClick={dong}
            aria-label="Đóng giỏ mua"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-tint/70 text-ink hover:bg-tint"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-3">
            {gio.mon.map((m) => (
              <DongMon key={m.id} m={m} flash={flash} />
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between">
            <button type="button" onClick={dong} className="min-h-[44px] text-sm font-semibold text-accent-dark hover:underline">
              + Chọn thêm mẫu
            </button>
            <button type="button" onClick={xoaHetGio} className="min-h-[44px] text-sm text-ink/60 hover:text-ink">
              Xoá hết
            </button>
          </div>

          {/* Quà tặng */}
          {QUA_TANG.length > 0 && (
            <div className={`mt-3 rounded-2xl p-4 ${t.moc ? 'bg-accent/10' : 'bg-tint/70'}`}>
              <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                <IconQua />
                {t.moc
                  ? `Bạn được tặng 1 mẫu giá ${k(t.moc.tang)}`
                  : `Đơn từ ${k(QUA_TANG[0].don)} được tặng 1 mẫu ${k(QUA_TANG[0].tang)}`}
              </p>
              {t.mocKe && (
                <p className="mt-1 text-sm text-ink/75">
                  Thêm {formatVndD(t.conThieu)} nữa để {t.moc ? 'nâng lên' : 'được'} quà mẫu {k(t.mocKe.tang)}.
                </p>
              )}
              {t.moc && quaDuocChon.length > 0 && (
                <>
                  <p className="mt-3 text-[13px] font-semibold text-ink/80">Chạm để chọn quà:</p>
                  <ul className="no-scrollbar -mx-4 mt-2 flex gap-2.5 overflow-x-auto px-4 pb-1">
                    {quaDuocChon.map((p) => {
                      const chon = t.qua?.id === p.id;
                      return (
                        <li key={p.id} className="w-[96px] shrink-0">
                          <button
                            type="button"
                            onClick={() => chonQua(chon ? null : monMuaTuSanPham(p))}
                            aria-pressed={chon}
                            aria-label={`${chon ? 'Bỏ chọn' : 'Chọn'} ${p.name} làm quà`}
                            className="block w-full text-left"
                          >
                            <span className={`relative block aspect-[3/4] overflow-hidden rounded-xl bg-tint ring-2 transition ${chon ? 'ring-accent' : 'ring-transparent'}`}>
                              <Image src={p.image!} alt="" fill sizes="96px" placeholder="blur" blurDataURL={GLASS_BLUR_DATA_URL} className="object-cover" />
                              {chon && (
                                <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                                  </svg>
                                </span>
                              )}
                            </span>
                            <span className="mt-1 line-clamp-1 text-[12px] font-medium text-ink">{p.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}

          <p className="mt-4 text-xs font-bold text-ink">Tin nhắn gửi tiệm</p>
          <p className="mt-1 whitespace-pre-line rounded-2xl bg-surface p-3 text-sm leading-relaxed text-ink ring-1 ring-inset ring-hairline">
            {tinNhan}
          </p>
        </div>

        <div className="border-t border-hairline bg-surface px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold text-ink">Tổng ({gio.mon.length} mẫu)</span>
            <span className="text-2xl font-bold leading-none text-accent-dark tabular-nums">{formatVndD(t.tong)}</span>
          </div>
          {t.tietKiem > 0 && (
            <p className="mt-1 text-right text-[13px] font-semibold text-emerald-700">Flash sale đã giảm {formatVndD(t.tietKiem)}</p>
          )}
          <p className="mt-1 text-xs text-ink/60">Chưa gồm phí ship. Tiệm xác nhận mẫu còn hàng khi bạn nhắn — ai chốt trước lấy trước.</p>
          <button
            type="button"
            onClick={() => moLienHe({ tinNhan, viTri: 'gio-mua', maSp: gio.mon.map((m) => m.id).join(',') })}
            className="mt-3 flex min-h-[52px] w-full items-center justify-center rounded-full bg-ink text-[16px] font-semibold text-surface transition hover:bg-accent-dark active:scale-[0.98]"
          >
            Gửi đơn cho tiệm
          </button>
        </div>
      </div>
    </div>
  );
}

function DongMon({ m, flash }: { m: MonMua; flash: Set<string> }) {
  const coFlash = flash.has(m.id) && m.giaPass > 0;
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-surface p-2.5 ring-1 ring-inset ring-hairline">
      <Link href={`/san-pham/${m.slug}`} className="relative h-20 w-[60px] shrink-0 overflow-hidden rounded-lg bg-tint">
        {m.image && <Image src={m.image} alt={m.name} fill sizes="60px" placeholder="blur" blurDataURL={GLASS_BLUR_DATA_URL} className="object-cover" />}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-medium text-ink">{m.name}</p>
        <p className="line-clamp-1 text-xs text-ink/60">{[m.size && `Size ${m.size}`, m.note && `Tình trạng ${m.note}`].filter(Boolean).join(' · ') || ' '}</p>
        <p className="mt-0.5 text-sm">
          {m.giaPass > 0 ? (
            <>
              <span className="font-semibold text-accent-dark">{formatVndD(coFlash ? giaFlash(m.giaPass) : m.giaPass)}</span>
              {coFlash && (
                <>
                  <s className="ml-1.5 text-ink/45">{formatVndD(m.giaPass)}</s>
                  <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">−{PHAN_TRAM_FLASH}%</span>
                </>
              )}
            </>
          ) : (
            <span className="font-semibold text-accent-dark">Giá liên hệ</span>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => boKhoiGio(m.id)}
        aria-label={`Bỏ ${m.name} khỏi giỏ`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint/60 text-ink/60 hover:text-ink"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </li>
  );
}

function IconGio() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2l2.2 11h11.3L21 7H6.2" />
      <circle cx="9" cy="19.5" r="1.4" />
      <circle cx="17" cy="19.5" r="1.4" />
    </svg>
  );
}

export function IconQua({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" className="shrink-0 text-accent-dark">
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 7.5 4.5 9 8 12 8zm0 0s1.5-5 4.5-3.5S15 8 12 8z" />
    </svg>
  );
}
