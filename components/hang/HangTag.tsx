import type { MauHang } from '@/lib/hang-khach';

/**
 * Nhãn treo (hang-tag) — chính cái nhãn tiệm treo ở cổ mỗi chiếc đầm, ở đây
 * thành "thẻ hạng". Cắt vát hai góc trên, có lỗ xỏ dây, nền là màu của hạng.
 *
 * Không dùng hook nên dùng được cả trong server component lẫn client component.
 */
export function HangTag({
  ten,
  dong,
  mau,
  lon = false,
  className = '',
}: {
  ten: string;
  /** Dòng nhỏ dưới tên, vd "Giảm 15%". */
  dong: string;
  mau: MauHang;
  /** Bản lớn cho ô tính hạng; bản nhỏ treo trên ảnh đầm. */
  lon?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative flex flex-col items-center justify-end text-center text-ink transition-colors duration-300 [clip-path:polygon(22%_0,78%_0,100%_16%,100%_100%,0_100%,0_16%)] ${
        lon ? 'h-56 w-40 rounded-b-2xl px-4 pb-6 sm:h-72 sm:w-52' : 'h-[8.5rem] w-[6.5rem] rounded-b-xl px-2 pb-3'
      } ${className}`}
      style={{ backgroundColor: mau.nen }}
    >
      {/* Lỗ xỏ dây: viền tông đậm, ruột màu nền trang. */}
      <span
        aria-hidden="true"
        className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-bg transition-colors duration-300 ${
          lon ? 'top-5 size-5 border-[5px]' : 'top-3 size-3 border-[3px]'
        }`}
        style={{ borderColor: mau.dam }}
      />
      <span className={`font-serif leading-tight ${lon ? 'text-5xl' : 'text-xl'}`}>{ten}</span>
      <span className={`mt-1 font-medium ${lon ? 'text-base' : 'text-[15px]'}`}>{dong}</span>
    </span>
  );
}
