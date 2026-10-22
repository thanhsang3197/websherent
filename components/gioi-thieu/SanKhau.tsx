'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';

/**
 * Khung gương vòm đứng yên ở nửa trái trang Giới thiệu (máy tính). Mỗi phần
 * nội dung bên phải gắn `data-canh="<số>"`; phần nào đang ở giữa màn hình thì
 * gương đổi sang ảnh đầm tương ứng. Lúc vào trang khung mở từ dưới lên một
 * lần (lớp `gt-man`). Giảm chuyển động thì vẫn đổi ảnh nhưng không mở khung.
 */
export function SanKhau({ anh }: { anh: string[] }) {
  const [dang, setDang] = useState(0);

  useEffect(() => {
    const canh = Array.from(document.querySelectorAll<HTMLElement>('[data-canh]'));
    if (canh.length === 0 || anh.length < 2 || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.canh) || 0;
          setDang(i % anh.length);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const el of canh) io.observe(el);
    return () => io.disconnect();
  }, [anh.length]);

  if (anh.length === 0) return <div className="gt-san arch bg-tint" />;

  return (
    <div className="gt-san gt-man arch relative overflow-hidden bg-tint">
      {anh.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? 'Đầm cho thuê ở tiệm SHERENT' : ''}
          fill
          priority={i === 0}
          placeholder="blur"
          blurDataURL={GLASS_BLUR_DATA_URL}
          sizes="(max-width: 1024px) 100vw, 45vw"
          className={`object-cover transition-opacity duration-700 ${i === dang ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
}
