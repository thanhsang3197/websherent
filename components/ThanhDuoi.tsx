'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTuiDo } from '@/lib/tui-do';
import { moLienHe } from '@/components/LienHeSheet';

/**
 * Thanh điều hướng dưới đáy — CHỈ trên điện thoại (md:hidden), thay cho nút
 * Zalo nổi cũ (StickyContactBar). Bốn việc khách hay làm nhất luôn trong tầm
 * ngón cái: về trang chủ, tìm mẫu, mở túi đồ, nhắn tiệm (chủ shop chốt
 * 13/11/2026).
 *
 * app/layout.tsx chừa `pb-[68px]` cho body trên điện thoại để thanh này không
 * che chân trang.
 */
export function ThanhDuoi() {
  const pathname = usePathname();
  const tui = useTuiDo();

  // Trang chi tiết có thanh hành động riêng (♡ / Thêm vào túi / Nhắn giữ mẫu,
  // components/ChiTietThue.tsx) chiếm chỗ này — chủ shop chọn 13/11/2026.
  if (pathname.startsWith('/san-pham/')) return null;

  const muc = 'nhan-co flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold';
  const mau = (on: boolean) => (on ? 'text-accent' : 'text-muted');

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(64px+env(safe-area-inset-bottom))] grid-cols-4 border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(30,26,27,0.06)] backdrop-blur md:hidden"
    >
      <Link href="/" className={`${muc} ${mau(pathname === '/')}`} aria-current={pathname === '/' ? 'page' : undefined}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
        Trang chủ
      </Link>
      <Link href="/#san-pham" className={`${muc} text-muted`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5 21 21" />
        </svg>
        Tìm mẫu
      </Link>
      <Link
        href="/tui-do"
        className={`${muc} ${mau(pathname === '/tui-do')}`}
        aria-current={pathname === '/tui-do' ? 'page' : undefined}
        aria-label={`Túi đồ muốn thuê, ${tui.length} mẫu`}
      >
        <span className="relative" data-dich-tui>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.2 12H6.2z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          {tui.length > 0 && (
            <span key={tui.length} className="huy-hieu-nay absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white">
              {tui.length}
            </span>
          )}
        </span>
        Túi đồ
      </Link>
      <button type="button" onClick={() => moLienHe({ viTri: 'thanh-duoi' })} className={`${muc} text-muted`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
        Nhắn tiệm
      </button>
    </nav>
  );
}
