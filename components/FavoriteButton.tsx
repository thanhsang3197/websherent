'use client';

import { useFavorites } from '@/lib/useFavorites';

/**
 * Nút ❤ yêu thích — dùng ở ProductCard (đè lên góc ảnh) và trang chi tiết.
 * LUÔN đặt làm anh em (sibling) của <Link>, không lồng bên trong, để tránh
 * <button> nằm trong <a> (sai chuẩn HTML) và tránh vô tình điều hướng khi bấm.
 */
export function FavoriteButton({
  slug,
  className = '',
  size = 'sm',
  withLabel = false,
}: {
  slug: string;
  className?: string;
  /** 'sm' = nút tròn nhỏ đè lên ảnh (mặc định); 'md' = nút lớn hơn cho trang chi tiết. */
  size?: 'sm' | 'md';
  /** Hiện thêm chữ "Yêu thích" bên cạnh icon (dùng cho size 'md'). */
  withLabel?: boolean;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);
  const dimension = size === 'md' ? 'h-11 px-4' : 'h-9 w-9';

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={active ? 'Bỏ khỏi mục yêu thích' : 'Thêm vào mục yêu thích'}
      className={`glass-pill flex items-center justify-center gap-2 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 ${dimension} ${className}`}
    >
      <HeartIcon filled={active} size={size} />
      {withLabel && (
        <span className="text-sm font-medium text-ink">
          {active ? 'Đã yêu thích' : 'Yêu thích'}
        </span>
      )}
    </button>
  );
}

function HeartIcon({ filled, size }: { filled: boolean; size: 'sm' | 'md' }) {
  const px = size === 'md' ? 20 : 18;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? 'text-accent-dark' : 'text-ink/70'}
      aria-hidden="true"
    >
      <path d="M20.8 4.6c-1.9-1.6-4.7-1.4-6.5.5L12 7.4l-2.3-2.3c-1.8-1.9-4.6-2-6.5-.5-2.2 1.8-2.3 5.1-.3 7.1l8.8 8.8c.2.2.5.2.7 0l8.8-8.8c2-2 1.9-5.3-.3-7.1z" />
    </svg>
  );
}
