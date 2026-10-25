'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GLASS_BLUR_DATA_URL } from '@/lib/format';
import { NEN_O } from '@/lib/thanh-ly';

/**
 * Khảm ảnh đầu trang Thanh lý: mỗi lượt xem bốc ngẫu nhiên 5 mẫu trong toàn bộ
 * danh sách. Bốc ở trình duyệt (không ở server) để trang vẫn là trang tĩnh ISR —
 * bốc ở server thì mỗi lượt xem phải dựng lại trang và gọi app nội bộ.
 * Trước khi bốc xong chỉ hiện các ô màu trống, để không chớp từ bộ ảnh này
 * sang bộ ảnh khác.
 */
export function KhamThanhLy({ anh }: { anh: string[] }) {
  const [chon, setChon] = useState<string[] | null>(null);

  useEffect(() => {
    const tron = [...anh];
    for (let i = tron.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tron[i], tron[j]] = [tron[j], tron[i]];
    }
    setChon(tron.slice(0, 5));
  }, [anh]);

  const lon = chon?.slice(0, 3) ?? [];
  const nho = chon ? chon.slice(3, 5) : anh.slice(3, 5);

  return (
    <div className="grid grid-cols-3 gap-2.5">
      <div className={`${NEN_O[0]} col-span-2 row-span-2 p-4`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          {lon.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              placeholder="blur"
              blurDataURL={GLASS_BLUR_DATA_URL}
              sizes="30vw"
              className="tl-doi object-cover"
              // Độ trễ âm: ảnh i hiện ở giây 6i–6i+6 của mỗi vòng 18 giây.
              style={{ animationDelay: `-${(18 - i * 6) % 18}s` }}
            />
          ))}
        </div>
      </div>
      {nho.map((src, i) => (
        <div key={i} className={`${NEN_O[i + 1]} p-2.5`}>
          <div className="relative aspect-[3/4] overflow-hidden">
            {chon && (
              <Image
                src={src}
                alt=""
                fill
                placeholder="blur"
                blurDataURL={GLASS_BLUR_DATA_URL}
                sizes="15vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
