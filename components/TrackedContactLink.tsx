'use client';

import type { ReactNode } from 'react';
import { trackCallClick, trackMessengerClick, trackZaloClick, type ViTri } from '@/lib/analytics';

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
  /** 'zalo' / 'messenger' mở app chat (tab mới), 'goi' là link tel:. */
  kieu: 'zalo' | 'messenger' | 'goi';
  viTri: ViTri;
  maSp?: string | null;
  className?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const moTabMoi = kieu !== 'goi';
  return (
    <a
      href={href}
      className={className}
      // Link tel: mở app gọi ngay trên máy -> không mở tab mới.
      target={moTabMoi ? '_blank' : undefined}
      rel={moTabMoi ? 'noopener noreferrer' : undefined}
      onClick={() =>
        kieu === 'zalo'
          ? trackZaloClick(viTri, maSp)
          : kieu === 'messenger'
            ? trackMessengerClick(viTri, maSp)
            : trackCallClick(viTri)
      }
      {...rest}
    >
      {children}
    </a>
  );
}
