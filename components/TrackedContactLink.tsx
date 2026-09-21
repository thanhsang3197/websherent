'use client';

import type { ReactNode } from 'react';
import { trackCallClick, trackZaloClick, type ViTri } from '@/lib/analytics';

/**
 * Thẻ <a> liên hệ có ghi nhận sự kiện — dành cho các trang/khối là SERVER
 * component (Footer, /thanh-ly), nơi không gắn onClick trực tiếp được.
 *
 * Cố ý làm mỏng: chỉ thêm một cú `track` rồi để trình duyệt mở link như
 * thường. Nhờ vậy phần còn lại của Footer vẫn là server component, không kéo
 * thêm JS xuống máy khách.
 */
export function TrackedContactLink({
  href,
  kieu,
  viTri,
  maSp,
  className,
  children,
  ...rest
}: {
  href: string;
  /** 'zalo' mở Zalo (tab mới), 'goi' là link tel:. */
  kieu: 'zalo' | 'goi';
  viTri: ViTri;
  maSp?: string | null;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const laZalo = kieu === 'zalo';
  return (
    <a
      href={href}
      className={className}
      // Link tel: mở app gọi ngay trên máy -> không mở tab mới.
      target={laZalo ? '_blank' : undefined}
      rel={laZalo ? 'noopener noreferrer' : undefined}
      onClick={() => (laZalo ? trackZaloClick(viTri, maSp) : trackCallClick(viTri))}
      {...rest}
    >
      {children}
    </a>
  );
}
