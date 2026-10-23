'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { trackMessengerClick, trackZaloClick } from '@/lib/analytics';

/**
 * Header (dính cùng PromoBar, xem app/layout.tsx), tối giản, mobile-first. Menu mobile mở/đóng bằng nút (có JS nhẹ).
 */
/** Các mục luôn hiện trên menu desktop, theo thứ tự chủ shop chọn 24/10/2026. */
const NAV_CHINH: string[] = ['/#san-pham', '/thanh-ly', '/album', '/hang-thanh-vien'];

/** Kiểu chung của hai bảng thả xuống ở menu desktop và từng dòng trong đó. */
const bangClass =
  'absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-surface p-1.5 text-sm text-ink shadow-glass-lg ring-1 ring-hairline';
const dongBangClass = 'block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-tint/50';

export function Header({ coAlbum = false }: { coAlbum?: boolean }) {
  const [open, setOpen] = useState(false);
  // Bảng thả xuống đang mở ở menu desktop: "Thêm" hoặc "Liên hệ" (một lúc một cái).
  const [bangMo, setBangMo] = useState<'them' | 'lien-he' | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Bảng thả xuống (desktop) đóng khi bấm ra ngoài hoặc nhấn Esc.
  useEffect(() => {
    if (!bangMo) return;
    const dongBamNgoai = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setBangMo(null);
    };
    const dongEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBangMo(null);
    };
    document.addEventListener('mousedown', dongBamNgoai);
    document.addEventListener('keydown', dongEsc);
    return () => {
      document.removeEventListener('mousedown', dongBamNgoai);
      document.removeEventListener('keydown', dongEsc);
    };
  }, [bangMo]);

  // "Album" chen ngay sau "Sản phẩm", CHỈ khi đang có album: bản app chưa có
  // tính năng album hoặc shop tắt hết thì menu không dẫn tới trang trống.
  // Một mục chung chứ không liệt kê từng album — shop thêm album là menu
  // desktop không bị tràn.
  const nav = coAlbum
    ? siteConfig.nav.flatMap((item) =>
        item.href === '/#san-pham' ? [item, { label: 'Album', href: '/album' }] : [item],
      )
    : siteConfig.nav;

  // Menu desktop (24/10/2026): 8 mục + nút liên hệ tràn ở 1024px, nên chỉ để
  // ngoài các mục chủ shop chọn, đúng thứ tự chủ shop đưa; phần còn lại vào
  // bảng "Thêm". "Trang chủ" bỏ ở desktop — bấm logo là về trang chủ. Menu ☰
  // điện thoại vẫn đủ cả.
  const navChinh = NAV_CHINH.flatMap((href) => nav.filter((item) => item.href === href));
  const navThem = nav.filter((item) => item.href !== '/' && !NAV_CHINH.includes(item.href));

  return (
    <header className="glass-header">
      {/*
        Điện thoại: header thấp (~48px thay vì 64px) — chủ shop 15/10/2026 muốn
        nhường chỗ cho ảnh/sản phẩm bên dưới, vì header + thanh ưu đãi dính
        trên đầu chiếm gần 1/7 màn hình 375px. Từ sm trở lên giữ nguyên.
      */}
      <div className="container-content flex min-h-12 items-center justify-between gap-3 py-1.5 sm:min-h-16 sm:py-3">
        <Link
          href="/"
          className="font-serif text-2xl font-bold uppercase leading-none tracking-wide text-ink sm:text-4xl"
          aria-label={`${siteConfig.name} — về trang chủ`}
        >
          {siteConfig.name}
        </Link>

        {/*
          Nav desktop — chỉ từ lg (1024px), dưới đó dùng nút ☰ như điện thoại.
          Logo · 4 mục chính · "Thêm ▾" · nút "Liên hệ ▾". Hai bảng thả xuống
          dùng chung một kiểu, mở cái này thì cái kia đóng.
        */}
        <nav ref={navRef} className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Chính">
          {navChinh.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-ink/80 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}

          {navThem.length > 0 && (
            <div className="relative">
              <button
                type="button"
                aria-expanded={bangMo === 'them'}
                aria-controls="nav-them"
                onClick={() => setBangMo((v) => (v === 'them' ? null : 'them'))}
                className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-ink/80 transition-colors hover:text-accent"
              >
                Thêm
                <span aria-hidden="true" className={`text-[10px] transition-transform ${bangMo === 'them' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {bangMo === 'them' && (
                <ul id="nav-them" className={`${bangClass} w-52`}>
                  {navThem.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setBangMo(null)} className={`${dongBangClass} font-medium`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/*
            Tách vai như menu điện thoại: tư vấn qua Messenger, Zalo hotline
            nhận phản ánh, góp ý — gom vào MỘT nút để menu không tràn.
          */}
          <div className="relative">
            <button
              type="button"
              aria-expanded={bangMo === 'lien-he'}
              aria-controls="lien-he-desktop"
              onClick={() => setBangMo((v) => (v === 'lien-he' ? null : 'lien-he'))}
              className="btn btn-primary whitespace-nowrap !px-4 !py-2 text-sm shadow-md"
            >
              Liên hệ
              <span aria-hidden="true" className={`ml-1 text-[10px] transition-transform ${bangMo === 'lien-he' ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {bangMo === 'lien-he' && (
              <ul id="lien-he-desktop" className={`${bangClass} w-72`}>
                <li>
                  <a
                    href={siteConfig.messengerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackMessengerClick('header');
                      setBangMo(null);
                    }}
                    className={dongBangClass}
                  >
                    <span className="block font-medium">Tư vấn qua Messenger</span>
                    <span className="block text-xs text-muted">Hỏi mẫu, size, lịch thuê</span>
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackZaloClick('header');
                      setBangMo(null);
                    }}
                    className={dongBangClass}
                  >
                    <span className="block font-medium">Hotline · Zalo {siteConfig.phone.display}</span>
                    <span className="block text-xs text-muted">Tiếp nhận phản ánh, góp ý</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* Toggle mobile */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/60 text-ink backdrop-blur sm:h-10 sm:w-10 lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="text-lg sm:text-xl">
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
            {/*
              Hai kênh tách vai (chủ shop 23/10/2026): tư vấn chọn đồ qua
              Messenger; Zalo hotline dành cho phản ánh, góp ý — ghi rõ ngay
              trên nút để khách không nhắn nhầm chỗ.
            */}
            <li className="flex flex-col gap-2.5 py-3">
              <a
                href={siteConfig.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
                onClick={() => {
                  trackMessengerClick('header');
                  setOpen(false);
                }}
              >
                Tư vấn qua Messenger
              </a>
              <a
                href={siteConfig.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full !flex-col !gap-0 leading-tight"
                onClick={() => {
                  trackZaloClick('header');
                  setOpen(false);
                }}
              >
                <span>Hotline · Zalo {siteConfig.phone.display}</span>
                <span className="mt-0.5 text-xs font-normal opacity-80">Tiếp nhận phản ánh, góp ý</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
