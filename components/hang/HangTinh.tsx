'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import type { HangKhach } from '@/types/hang-khach';
import { TEN_HANG_MOI, dieuKien, mauHang, tinhHang } from '@/lib/hang-khach';
import { HangTag } from '@/components/hang/HangTag';
import { trackTraHang } from '@/lib/analytics';

const so = (n: number) => n.toLocaleString('vi-VN');

/** "0987654321" -> "0987 ••• 321": hiện lại số khách vừa gõ mà không in nguyên số lên màn hình. */
const anSo = (sdt: string) => `${sdt.slice(0, 4)} ••• ${sdt.slice(-3)}`;

/** Kết quả tra thật từ app (qua /api/tra-hang). `ma` = 'Thường' khi số chưa lên hạng. */
interface TraCuu {
  ma: string;
  sdt: string;
}

/**
 * Ô "Bạn đang ở hạng nào?", hai cách:
 *
 * 1. TRA THẬT bằng số điện thoại (/api/tra-hang -> app, api-cong-khai.md §2.8).
 *    App chỉ trả TÊN HẠNG — không điểm, không số lượt — nên thẻ nói hạng hiện
 *    tại + quyền lợi + điều kiện hạng kế, không nói "còn thiếu bao nhiêu".
 *    Số không phải khách cũng ra "Thường" (cố ý, để không lộ ai là khách).
 * 2. ƯỚC TÍNH: kéo tổng phí thuê và số lượt, thẻ nói còn thiếu bao nhiêu.
 *
 * Thẻ bên phải hiện kết quả tra nếu có; khách kéo thanh ước tính thì thẻ quay
 * về kết quả ước tính. Chưa chạy JS thì vẫn hiện sẵn một kết quả ước tính mẫu.
 */
export function HangTinh({ dsHang, dongMoiDiem }: { dsHang: HangKhach[]; dongMoiDiem: number }) {
  const cao = dsHang[dsHang.length - 1];
  // Thanh kéo chạy tới quá hạng cao nhất một đoạn, làm tròn 100.000 đ.
  const phiToiDa = Math.ceil((cao.diemToiThieu * dongMoiDiem * 1.3) / 100_000) * 100_000;
  const luotToiDa = Math.max(20, Math.ceil((cao.luotToiThieu ?? 0) * 1.5));

  const [phi, setPhi] = useState(() => Math.round((dsHang[0].diemToiThieu * dongMoiDiem * 0.6) / 50_000) * 50_000);
  const [luot, setLuot] = useState(1);
  const idPhi = useId();
  const idLuot = useId();
  const idSdt = useId();

  const [sdt, setSdt] = useState('');
  const [dangTra, setDangTra] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [traCuu, setTraCuu] = useState<TraCuu | null>(null);
  const the = useRef<HTMLDivElement>(null);

  const traHang = async (e: FormEvent) => {
    e.preventDefault();
    if (dangTra) return;
    setDangTra(true);
    setLoi(null);
    try {
      const res = await fetch('/api/tra-hang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdt }),
      });
      const d = (await res.json().catch(() => ({}))) as { ma?: string; ten?: string; loi?: string };
      if (!res.ok || typeof d.ma !== 'string') {
        setLoi(d.loi ?? 'Chưa tra được, bạn thử lại sau ít phút nhé.');
        return;
      }
      // Chỉ gửi TÊN HẠNG cho thống kê, không gửi số điện thoại. 'Thường' hiện cho
      // khách là "chưa lên hạng" — ghi đúng chữ đó để bên app đọc dễ hiểu.
      trackTraHang(d.ma === 'Thường' ? 'Chưa lên hạng' : (dsHang.find((h) => h.ma === d.ma)?.ten ?? d.ten ?? d.ma));
      const chuSo = sdt.replace(/\D/g, '');
      setTraCuu({ ma: d.ma, sdt: chuSo.startsWith('84') ? `0${chuSo.slice(2)}` : chuSo });
      // Điện thoại: thẻ kết quả nằm dưới phần ước tính — đưa nó vào tầm mắt.
      requestAnimationFrame(() => the.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    } catch {
      setLoi('Mạng đang chập chờn, bạn thử lại nhé.');
    } finally {
      setDangTra(false);
    }
  };

  const kq = tinhHang(dsHang, dongMoiDiem, phi, luot);
  const hangTra = traCuu ? (dsHang.find((h) => h.ma === traCuu.ma) ?? null) : null;
  const keTra = traCuu ? (dsHang.find((h) => h.thuTu > (hangTra?.thuTu ?? 0)) ?? null) : null;
  const hangThe = traCuu ? hangTra : kq.hienTai;
  const mau = mauHang(hangThe);

  let loiKe: string;
  if (!kq.ke) {
    loiKe = 'Bạn đã ở hạng cao nhất của tiệm.';
  } else {
    const can: string[] = [];
    if (kq.thieuDiem > 0) can.push(`${so(kq.thieuDiem)} điểm (khoảng ${so(kq.thieuDiem * dongMoiDiem)} đ phí thuê)`);
    if (kq.thieuLuot > 0) can.push(`${kq.thieuLuot} lượt thuê`);
    loiKe = `Còn ${can.join(' và ')} nữa là lên ${kq.ke.ten}.`;
  }

  // Kéo thanh / bấm +− = khách đang ước tính, thẻ quay về kết quả ước tính.
  const doiPhi = (v: number) => {
    setTraCuu(null);
    setPhi(v);
  };
  const doiLuot = (d: number) => {
    setTraCuu(null);
    setLuot((l) => Math.min(luotToiDa, Math.max(0, l + d)));
  };

  let tieuDeThe: string;
  let noiDungThe: string;
  let ghiChuThe: string;
  if (traCuu) {
    if (hangTra) {
      const ql = [`giảm ${hangTra.giamPhanTram}% phí thuê`];
      if (hangTra.freePhuKien) ql.push('miễn phí thuê phụ kiện');
      tieuDeThe = `Số ${anSo(traCuu.sdt)} đang ở hạng ${hangTra.ten}`;
      noiDungThe =
        `Bạn được ${ql.join(' và ')}. ` +
        (keTra ? `Lên ${keTra.ten} khi đạt ${dieuKien(keTra)}.` : 'Đây là hạng cao nhất của tiệm.');
    } else {
      tieuDeThe = `Số ${anSo(traCuu.sdt)} chưa lên hạng`;
      noiDungThe = `Mỗi lượt thuê đều được tích điểm. Đạt ${dieuKien(dsHang[0])} là lên ${dsHang[0].ten}.`;
    }
    ghiChuThe = 'Hạng cập nhật sau mỗi lần bạn trả đồ.';
  } else {
    tieuDeThe = kq.hienTai ? `Bạn ở hạng ${kq.hienTai.ten}` : `Bạn là ${TEN_HANG_MOI.toLowerCase()}`;
    noiDungThe = `Bạn có ${so(kq.diem)} điểm và ${luot} lượt thuê. ${loiKe}`;
    ghiChuThe = 'Ước tính theo ngưỡng tiệm đang áp dụng.';
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-12 md:gap-6">
      <div className="md:col-span-6 lg:col-span-5" data-reveal>
        <form onSubmit={traHang} noValidate>
          <label htmlFor={idSdt} className="text-[17px] font-medium text-ink">
            Số điện thoại bạn dùng khi thuê
          </label>
          <div className="mt-3 flex gap-2">
            <input
              id={idSdt}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0987 654 321"
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
              maxLength={20}
              aria-invalid={loi ? true : undefined}
              aria-describedby={loi ? `${idSdt}-loi` : undefined}
              className="min-w-0 flex-1 rounded-full bg-tint/60 px-5 py-3.5 text-[17px] text-ink outline-none transition placeholder:text-ink/40 focus:bg-tint focus-visible:ring-2 focus-visible:ring-accent"
            />
            <button
              type="submit"
              disabled={dangTra || sdt.replace(/\D/g, '').length < 9}
              className="shrink-0 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-surface transition hover:bg-accent-dark active:scale-[0.97] disabled:opacity-50"
            >
              {dangTra ? 'Đang tra…' : 'Tra hạng'}
            </button>
          </div>
          {loi && (
            <p id={`${idSdt}-loi`} role="alert" className="mt-2 text-base text-accent-dark">
              {loi}
            </p>
          )}
        </form>

        <h3 className="mt-12 font-sans text-[17px] font-medium text-ink">Hoặc ước tính theo số đã thuê</h3>
        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-x-4">
            <label htmlFor={idPhi} className="text-[17px] font-medium text-ink">
              Phí thuê đã trả
            </label>
            <span className="whitespace-nowrap font-serif text-4xl tabular-nums text-ink sm:text-5xl">{so(phi)} đ</span>
          </div>
          <input
            id={idPhi}
            type="range"
            min={0}
            max={phiToiDa}
            step={50_000}
            value={phi}
            onChange={(e) => doiPhi(Number(e.target.value))}
            aria-valuetext={`${so(phi)} đồng, ${so(kq.diem)} điểm`}
            className="hang-range mt-4 w-full"
          />
        </div>

        <div className="mt-9">
          <div className="flex flex-wrap items-center justify-between gap-4" role="group" aria-labelledby={idLuot}>
            <span id={idLuot} className="text-[17px] font-medium text-ink">
              Số lượt đã trả đồ
            </span>
            <span className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => doiLuot(-1)}
              disabled={luot === 0}
              aria-label="Bớt một lượt"
              className="flex size-12 items-center justify-center rounded-full bg-tint text-2xl text-ink transition hover:bg-accent/25 active:scale-95 disabled:opacity-40"
            >
              −
            </button>
            <output aria-live="polite" className="min-w-[2ch] text-center font-serif text-4xl tabular-nums text-ink sm:text-5xl">
              {luot}
            </output>
            <button
              type="button"
              onClick={() => doiLuot(1)}
              disabled={luot === luotToiDa}
              aria-label="Thêm một lượt"
              className="flex size-12 items-center justify-center rounded-full bg-tint text-2xl text-ink transition hover:bg-accent/25 active:scale-95 disabled:opacity-40"
            >
              +
            </button>
            </span>
          </div>
        </div>
      </div>

      <div
        ref={the}
        className="scroll-mb-24 flex flex-col items-center gap-6 rounded-2xl px-6 py-10 text-center transition-colors duration-300 sm:flex-row sm:text-left md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7 lg:px-10"
        style={{ backgroundColor: `${mau.nen}99` }}
        data-reveal
        aria-live="polite"
      >
        <HangTag
          lon
          ten={hangThe?.ten ?? 'Mới'}
          dong={hangThe ? `Giảm ${hangThe.giamPhanTram}%` : 'Đang tích điểm'}
          mau={mau}
          className="shrink-0 -rotate-3"
        />
        <div>
          <p className="font-serif text-2xl leading-snug text-ink">{tieuDeThe}</p>
          <p className="mt-3 text-[17px] leading-relaxed text-ink">{noiDungThe}</p>
          <p className="mt-3 text-base text-muted">{ghiChuThe}</p>
        </div>
      </div>
    </div>
  );
}
