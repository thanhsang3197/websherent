import Image from 'next/image';
import { ACoSuKien } from '@/components/LinkCoSuKien';
import type { KenhMxh } from '@/lib/analytics';

export interface AnhKenh {
  src: string;
}

export interface TheKenh {
  kenh: KenhMxh;
  nenTang: 'instagram' | 'tiktok' | 'facebook';
  ten: string;
  handle: string;
  /** Dòng phụ dưới tên (vd "Video thử đồ"). Bỏ trống thì không vẽ. */
  moTa?: string;
  href: string;
  anh: AnhKenh[];
}

/**
 * "Theo dõi tiệm" — hàng thẻ giới thiệu các kênh mạng xã hội, nằm trong hero
 * (chủ shop chọn 16/11/2026, demo Canva). Mỗi thẻ: biểu tượng nền tảng + tên
 * tài khoản + 1 dòng mô tả + 3 ảnh khung vòm + nút "Theo dõi". Cả thẻ là MỘT
 * link tới kênh. KHÔNG hiện số người theo dõi (chủ shop chốt).
 *
 * Ảnh: mẫu đang cho thuê trên web (app/page.tsx chọn theo loại đồ của kênh).
 *
 * Điện thoại: một hàng vuốt ngang, thẻ rộng 78% để thẻ sau ló ra báo hiệu
 * vuốt được. Từ lg: 4 thẻ một hàng.
 */
export function TheoDoiTiem({
  the,
  canhHero = false,
}: {
  the: TheKenh[];
  /**
   * Nằm trong lưới hero (cột phải cạnh slogan trên máy tính): không tự bọc
   * container, máy tính xếp 2×2 thay vì 4 thẻ một hàng.
   */
  canhHero?: boolean;
}) {
  if (the.length === 0) return null;
  return (
    <div className={canhHero ? 'mt-6 sm:mt-10 lg:mt-0' : 'container-content mt-6 sm:mt-10'}>
      <h2 className="text-xl text-ink sm:text-2xl">Theo dõi tiệm tại đây</h2>
      {/* scroll-px-5: thẻ đầu dừng thẳng lề chữ (20px) thay vì dính mép màn hình khi bắt điểm vuốt. */}
      <ul className={`-mx-5 mt-3 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden ${canhHero ? '' : 'lg:grid-cols-4'}`}>
        {the.map((t, viTri) => (
          <li key={t.kenh} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <ACoSuKien
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              suKien={{ loai: 'mxh', viTri: 'trang-chu', kenh: t.kenh }}
              aria-label={`${t.ten} ${t.handle}${t.moTa ? ` — ${t.moTa}` : ''}`}
              className="group flex h-full flex-col rounded-3xl border border-hairline bg-surface p-3.5 shadow-glass transition-shadow hover:shadow-glass-hover"
            >
              <div className="flex items-center gap-2.5">
                <BieuTuong nenTang={t.nenTang} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-ink">{t.ten}</p>
                  <p className="truncate text-xs text-muted">{t.handle}</p>
                </div>
              </div>
              {t.moTa && <p className="mt-1.5 text-[13px] text-ink/80">{t.moTa}</p>}

              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {t.anh.slice(0, 3).map((a, i) => (
                  <div
                    key={a.src + i}
                    className="relative aspect-[3/4] overflow-hidden rounded-b-lg rounded-t-full bg-tint"
                  >
                    <Image
                      src={a.src}
                      alt=""
                      fill
                      sizes="384px"
                      // Thẻ đầu nằm ngay màn hình đầu tiên (hero không còn ảnh lớn): tải ngay.
                      priority={viTri === 0}
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                ))}
              </div>

              <span className="mt-3 block rounded-full py-2 text-center text-sm font-semibold text-accent-dark ring-[1.5px] ring-inset ring-accent/60 transition-colors group-hover:bg-accent-dark group-hover:text-white">
                Theo dõi
              </span>
            </ACoSuKien>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Biểu tượng nền tảng trong ô tròn màu nhận diện của nền tảng đó. */
function BieuTuong({ nenTang }: { nenTang: TheKenh['nenTang'] }) {
  const nen =
    nenTang === 'instagram'
      ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
      : nenTang === 'tiktok'
        ? 'bg-black'
        : 'bg-[#1877F2]';
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-white ${nen}`}
      aria-hidden="true"
    >
      {nenTang === 'instagram' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      )}
      {nenTang === 'tiktok' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .78-5.06V9.69a5.74 5.74 0 0 0-.78-.05 5.74 5.74 0 1 0 5.74 5.74V9.4a7.35 7.35 0 0 0 4.29 1.37V7.68a4.28 4.28 0 0 1-3.29-1.86Z" />
        </svg>
      )}
      {nenTang === 'facebook' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2C11.54 2 9.68 3.66 9.68 6.7v2.62H6.61v3.56h3.07V22h3.68v-9.12h3.06l.46-3.56h-3.52V7.05c0-1.05.28-1.73 1.76-1.73Z" />
        </svg>
      )}
    </span>
  );
}
