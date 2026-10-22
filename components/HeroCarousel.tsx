'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroSlide } from '@/types/hero';
import { siteConfig } from '@/lib/site-config';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

const INTERVAL_MS = 5000; // đổi ảnh mỗi 5 giây
const ANIM_MS = 700; // thời lượng hiệu ứng trượt

const SIZES = '(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px';

/**
 * Slideshow hero: tự đổi mỗi 5s, hiệu ứng trượt phải→trái.
 * Tôn trọng prefers-reduced-motion: không tự chạy nếu người dùng bật giảm chuyển động.
 * Rỗng -> khung monogram; 1 slide -> ảnh tĩnh.
 *
 * Slide có thể là MẪU hoặc ẢNH TỰ DO shop treo (banner, ảnh studio). Ảnh tự do
 * mang thêm `caption` (chữ đè lên ảnh) và `href` (bấm vào đi đâu) —
 * api-cong-khai.md §2.3. Cả hai đều không bắt buộc: `caption` null thì KHÔNG vẽ
 * khối chữ rỗng, `href` null thì slide đơn thuần là ảnh, không bấm được.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const lastRef = useRef(0);

  // Tự động chuyển ảnh (bỏ qua nếu <=1 ảnh hoặc người dùng giảm chuyển động).
  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  // Khi ảnh hiện tại đổi -> giữ ảnh cũ lại để trượt ra, rồi bỏ sau khi xong.
  useEffect(() => {
    if (lastRef.current === current) return;
    setPrev(lastRef.current);
    lastRef.current = current;
    const t = setTimeout(() => setPrev(null), ANIM_MS);
    return () => clearTimeout(t);
  }, [current]);

  if (slides.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-tint">
        <span className="font-serif text-7xl text-accent/60">
          {siteConfig.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <>
      {prev !== null && prev !== current && (
        <div key={`prev-${prev}`} className="absolute inset-0 bg-tint hero-slide-out">
          <Image
            src={slides[prev].url}
            alt=""
            aria-hidden
            fill
            placeholder="blur"
            blurDataURL={GLASS_BLUR_DATA_URL}
            sizes={SIZES}
            className={classAnh(slides[prev].kieu)}
          />
        </div>
      )}
      <div
        key={`cur-${current}`}
        className={`absolute inset-0 bg-tint ${prev !== null ? 'hero-slide-in' : ''}`}
      >
        <Image
          src={slides[current].url}
          alt={slides[current].alt}
          fill
          priority={current === 0}
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes={SIZES}
          className={classAnh(slides[current].kieu)}
        />

        {/* Chữ shop muốn hiện đè lên ảnh tự do. null -> không vẽ gì. */}
        {slides[current].caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-10">
            <p className="text-balance text-center font-serif text-lg leading-snug text-white drop-shadow">
              {slides[current].caption}
            </p>
          </div>
        )}

        {/* Cả slide thành một vùng bấm được khi shop có gắn liên kết. */}
        {slides[current].href && (
          <SlideLink href={slides[current].href as string} label={slides[current].alt} />
        )}
      </div>
    </>
  );
}

/**
 * Vùng bấm phủ kín slide.
 *
 * Liên kết shop nhập có thể là đường dẫn trong web ("/khuyen-mai") hoặc URL
 * ngoài (fanpage, form đăng ký). `next/link` chỉ hợp với đường dẫn nội bộ —
 * đưa URL ngoài vào nó sẽ cố prefetch một trang không thuộc web này.
 */
function SlideLink({ href, label }: { href: string; label: string }) {
  const laNgoai = /^https?:\/\//i.test(href);

  if (laNgoai) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="absolute inset-0"
      />
    );
  }

  return <Link href={href} aria-label={label} className="absolute inset-0" />;
}

/**
 * Cách lấp khung cho từng loại slide.
 *
 * `object-cover` phủ kín khung nhưng CẮT phần thừa. Với ảnh chụp mẫu thì đúng
 * — ảnh đã chụp dọc sẵn, cắt hai mép không mất gì.
 *
 * Ảnh tự do thì ngược lại: tỉ lệ tuỳ ý (ảnh chụp màn hình trang IG, banner
 * ngang…) và chữ shop muốn khách đọc — tên IG/Facebook, nội dung ưu đãi —
 * thường nằm ngay MÉP TRÊN, đúng chỗ bị cắt đầu tiên. Nên dùng `object-contain`
 * để thấy trọn ảnh; phần thừa lấp bằng nền `bg-tint` cho ra vẻ có chủ ý.
 */
function classAnh(kieu: HeroSlide['kieu']): string {
  return kieu === 'anh' ? 'object-contain' : 'object-cover';
}
