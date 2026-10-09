'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { guiSuKienLink, type SuKienLink } from '@/lib/analytics';

/**
 * `next/link` có ghi một sự kiện khi bấm — cho các khối là SERVER component
 * (UuDaiSection, AlbumCard), nơi không gắn `onClick` trực tiếp được. Cùng ý
 * với `TrackedContactLink`: chỉ thêm một cú `track`, phần còn lại của khối vẫn
 * là server component, không kéo thêm JS xuống máy khách.
 *
 * `suKien` là dữ liệu thuần (không phải hàm) vì props đi từ server sang client
 * phải tuần tự hoá được.
 */
export function LinkCoSuKien({
  suKien,
  onClick,
  ...rest
}: ComponentProps<typeof Link> & { suKien: SuKienLink }) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        guiSuKienLink(suKien);
        onClick?.(e);
      }}
    />
  );
}

/** Thẻ `<a>` ra ngoài (mạng xã hội) có ghi sự kiện — cùng lý do như trên. */
export function ACoSuKien({
  suKien,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { suKien: SuKienLink }) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        guiSuKienLink(suKien);
        onClick?.(e);
      }}
    />
  );
}
