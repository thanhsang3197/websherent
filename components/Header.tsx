'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { trackZaloClick } from '@/lib/analytics';

/**
 * Header (dính cùng PromoBar, xem app/layout.tsx), tối giản, mobile-first. Menu mobile mở/đóng bằng nút (có JS nhẹ).
 */
export function Header({ coAlbum = false }: { coAlbum?: boolean }) {
  const [open, setOpen] = useState(false);

  // "Album" chen ngay sau "Sản phẩm", CHỈ khi đang có album: bản app chưa có
  // tính năng album hoặc shop tắt hết thì menu không dẫn tới trang trống.
  // Một mục chung chứ không liệt kê từng album — shop thêm album là menu
  // desktop không bị tràn.
  const nav = coAlbum
    ? siteConfig.nav.flatMap((item) =>
        item.href === '/#san-pham' ? [item, { label: 'Album', href: '/album' }] : [item],
      )
    : siteConfig.nav;

  return (
    <header className="glass-header">
      <div className="container-content flex min-h-16 items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="font-serif text-3xl font-bold uppercase leading-none tracking-wide text-ink sm:text-4xl"
          aria-label={`${siteConfig.name} — về trang chủ`}
        >
          {siteConfig.name}
        </Link>

        {/* Nav desktop */}
        {/*
          Menu ngang chỉ từ lg (1024px). Thêm mục "Album" (17/09/2026) làm menu
          chật: ở ~950px "Trang chủ", "Sản phẩm"… gãy hai dòng, còn ở 768px
          tràn ngang cả trang. Dưới lg dùng nút ☰ như điện thoại.
        */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-8" aria-label="Chính">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-ink/80 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackZaloClick('header')}
            className="btn btn-primary whitespace-nowrap !px-4 !py-2 text-sm shadow-md"
          >
            Nhắn Zalo
          </a>
        </nav>

        {/* Toggle mobile */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface/60 text-ink backdrop-blur lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="text-xl">
            {open ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Panel mobile */}
      {open && (
        <nav
          id="menu-mobile"
          aria-label="Chính (mobile)"
          className="border-t border-white/60 bg-surface/90 backdrop-blur-xl lg:hidden"
        >
          <ul className="container-content flex flex-col py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-sm font-medium text-ink/90 transition-colors hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-3">
              <a
                href={siteConfig.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
                onClick={() => {
                  trackZaloClick('header');
                  setOpen(false);
                }}
              >
                Nhắn Zalo {siteConfig.phone.display}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
