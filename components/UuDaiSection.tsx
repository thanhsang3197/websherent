import Image from 'next/image';
import Link from 'next/link';
import type { UuDai } from '@/types/uu-dai';
import { kieuLoai, nhanHan } from '@/lib/uu-dai';

/**
 * Bề rộng thẻ theo số chương trình — viết nguyên văn để Tailwind JIT thấy.
 * Điện thoại: thẻ KHÔNG chiếm hết bề rộng để thẻ kế tiếp ló ra một phần, báo
 * hiệu vuốt ngang được. Từ sm trở lên: 2 hoặc 3 thẻ vừa khít một hàng (khe
 * `gap-3` = 0,75rem nên trừ phần chia đều của khe).
 */
function lopRong(n: number): string {
  if (n === 1) return 'w-full';
  if (n === 2) return 'w-[86%] sm:w-[calc(50%-0.375rem)]';
  return 'w-[86%] sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]';
}

/**
 * Khối "Ưu đãi" ngay dưới ảnh đầu trang. Rỗng thì ẩn CẢ KHỐI, kể cả tiêu đề —
 * gồm cả lúc bản app đang chạy chưa có tính năng ưu đãi.
 *
 * Cố ý GỌN: mỗi chương trình là một thẻ ngang thấp (ảnh vuông nhỏ + chữ), để
 * bộ sưu tập bên dưới hiện sớm. Chi tiết, thể lệ đầy đủ nằm ở trang /uu-dai.
 * Nhiều chương trình thì xếp một hàng vuốt ngang (điện thoại) / 2–3 thẻ một
 * hàng (máy tính).
 */
export function UuDaiSection({ items }: { items: UuDai[] }) {
  if (items.length === 0) return null;

  return (
    <section className="container-content pt-6 sm:pt-8" aria-labelledby="uu-dai-tieu-de">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="uu-dai-tieu-de" className="font-serif text-xl text-ink sm:text-2xl">
          Ưu đãi đang có
        </h2>
        <Link
          href="/uu-dai"
          className="shrink-0 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
        >
          Xem thể lệ →
        </Link>
      </div>

      {/* -mx-5/px-5: hàng vuốt chạy sát mép màn hình điện thoại thay vì bị cắt ở lề. */}
      <ul
        className="-mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((u, i) => {
          const han = nhanHan(u.ketThuc);
          const kieu = kieuLoai(u.loai);
          return (
            <li key={u.id} className={`${lopRong(items.length)} shrink-0 snap-start`}>
              <Link
                href={`/uu-dai#${u.id}`}
                className="group flex h-full items-center gap-3 rounded-2xl border border-hairline bg-surface p-2.5 shadow-glass transition-shadow hover:shadow-glass-hover sm:gap-4 sm:p-3"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-tint sm:size-20">
                  {u.anh ? (
                    <Image
                      src={u.anh}
                      alt={u.tieuDe}
                      fill
                      sizes="80px"
                      // Khối ngay dưới hero: thẻ đầu có thể nằm trong màn hình đầu tiên.
                      priority={i === 0}
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center bg-gradient-to-br text-3xl sm:text-4xl ${kieu.nen}`}
                      aria-hidden="true"
                    >
                      {kieu.icon}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${kieu.badge}`}
                  >
                    {u.loaiTen}
                  </span>
                  <h3 className="mt-1 line-clamp-2 font-serif text-base leading-snug text-ink sm:text-lg">
                    {u.tieuDe}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:text-sm">
                    <span className="font-semibold text-accent-dark">{han ?? 'Đang diễn ra'}</span>
                    {u.moTaNgan && <> · {u.moTaNgan}</>}
                  </p>
                </div>

                <span
                  className="shrink-0 pr-1 text-lg text-accent-dark transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
