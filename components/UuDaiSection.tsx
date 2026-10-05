import Image from 'next/image';
import Link from 'next/link';
import type { UuDai } from '@/types/uu-dai';
import { nhanHan } from '@/lib/uu-dai';

/**
 * Bề rộng thẻ theo số chương trình — viết nguyên văn để Tailwind JIT thấy.
 * Điện thoại: thẻ KHÔNG chiếm hết bề rộng để thẻ kế tiếp ló ra một phần, báo
 * hiệu vuốt ngang được. Từ sm trở lên: 2 hoặc 3 thẻ vừa khít một hàng (khe
 * `gap-3` = 0,75rem nên trừ phần chia đều của khe).
 */
function lopRong(n: number): string {
  if (n === 1) return 'w-full';
  if (n === 2) return 'w-[86%] sm:w-[calc(50%-0.375rem)]';
  return 'w-[78%] sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]';
}

/**
 * Khối "Ưu đãi" ngay dưới ảnh đầu trang. Rỗng thì ẩn CẢ KHỐI, kể cả tiêu đề —
 * gồm cả lúc bản app đang chạy chưa có tính năng ưu đãi.
 *
 * Điện thoại: một hàng thẻ vuốt ngang (cùng cách khối Feedback), chiều cao
 * thẻ vừa phải để bộ sưu tập bên dưới vẫn hiện sớm. Máy tính: 2–3 thẻ một hàng.
 */
export function UuDaiSection({ items }: { items: UuDai[] }) {
  if (items.length === 0) return null;

  const solo = items.length === 1;

  return (
    <section className="container-content pt-8 sm:pt-12" aria-labelledby="uu-dai-tieu-de">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Ưu đãi</p>
          <h2 id="uu-dai-tieu-de" className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
            Đang có tại Sherent
          </h2>
        </div>
        <Link
          href="/uu-dai"
          className="shrink-0 text-sm font-medium text-accent-dark underline-offset-4 hover:underline"
        >
          Xem thể lệ →
        </Link>
      </div>

      {/* -mx-5/px-5: hàng vuốt chạy sát mép màn hình điện thoại thay vì bị cắt ở lề. */}
      <ul
        className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((u, i) => {
          const han = nhanHan(u.ketThuc);
          return (
            <li key={u.id} className={`${lopRong(items.length)} shrink-0 snap-start`}>
              <Link
                href={`/uu-dai#${u.id}`}
                className={`group flex h-full overflow-hidden rounded-2xl border border-hairline bg-surface shadow-glass transition-shadow hover:shadow-glass-hover ${
                  solo ? 'flex-col md:flex-row' : 'flex-col'
                }`}
              >
                <div
                  className={`relative aspect-[16/10] shrink-0 bg-tint ${
                    solo ? 'md:aspect-auto md:min-h-[14rem] md:w-1/2' : ''
                  }`}
                >
                  {u.anh ? (
                    <Image
                      src={u.anh}
                      alt={u.tieuDe}
                      fill
                      sizes={solo ? '(max-width: 768px) 100vw, 576px' : '(max-width: 640px) 80vw, 384px'}
                      // Khối ngay dưới hero: thẻ đầu có thể nằm trong màn hình đầu tiên.
                      priority={i === 0}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/25 via-tint to-surface px-4 text-center font-serif text-2xl text-accent-dark">
                      {u.loaiTen}
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-accent-dark backdrop-blur">
                    {u.loaiTen}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="line-clamp-2 font-serif text-lg leading-snug text-ink sm:text-xl">
                    {u.tieuDe}
                  </h3>
                  {u.moTaNgan && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                      {u.moTaNgan}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs sm:text-sm">
                    <span className="font-semibold text-accent-dark">{han ?? 'Đang diễn ra'}</span>
                    <span className="font-medium text-accent-dark group-hover:underline">
                      Xem thể lệ →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
