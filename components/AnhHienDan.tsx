'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * next/image hiện dần (mờ -> rõ) khi ảnh tải xong, thay vì bật ra đột ngột
 * (13/11/2026). Khung chứa đã giữ sẵn tỉ lệ nên trang không nhảy.
 *
 * Ảnh `priority` (màn hình đầu) KHÔNG làm mờ: chúng là ảnh khách thấy đầu tiên,
 * để opacity 0 chờ JS chạy là làm chậm cảm giác tải trang.
 */
export function AnhHienDan({ alt, className = '', onLoad, priority, ...props }: ImageProps) {
  const [xong, setXong] = useState(false);
  if (priority) {
    return <Image {...props} alt={alt} priority className={className} onLoad={onLoad} />;
  }
  return (
    <Image
      {...props}
      alt={alt}
      className={`${className} transition-opacity duration-500 ease-out ${xong ? 'opacity-100' : 'opacity-0'}`}
      onLoad={(e) => {
        setXong(true);
        onLoad?.(e);
      }}
    />
  );
}
