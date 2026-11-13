'use client';

/**
 * Hiệu ứng tương tác dùng chung (13/11/2026):
 *  - `thongBao`: thông báo nhỏ trồi lên đáy màn hình (component ThongBao trong
 *    app/layout.tsx lắng nghe).
 *  - `bayVaoTui`: một chấm màu bay từ nút vừa bấm tới biểu tượng Túi đồ đang
 *    hiện (thanh dưới đáy trên điện thoại, header trên máy tính).
 *
 * Khách bật "giảm chuyển động" thì bỏ hẳn phần bay, chỉ còn thông báo.
 */

export interface ThongBaoChiTiet {
  noiDung: string;
  /** Link phụ bên phải, vd { nhan: 'Xem túi', href: '/tui-do' }. */
  link?: { nhan: string; href: string };
}

export const SU_KIEN_THONG_BAO = 'sherent:thong-bao';

export function thongBao(tb: ThongBaoChiTiet) {
  window.dispatchEvent(new CustomEvent<ThongBaoChiTiet>(SU_KIEN_THONG_BAO, { detail: tb }));
}

function giamChuyenDong() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Biểu tượng túi đang thực sự hiện trên màn hình (có kích thước > 0). */
function dichDen(chon: string): HTMLElement | null {
  const ds = Array.from(document.querySelectorAll<HTMLElement>(chon));
  return ds.find((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }) ?? null;
}

/** `chon`: bộ chọn của đích bay tới — mặc định biểu tượng Túi đồ; giỏ mua thanh lý dùng '[data-dich-gio]'. */
export function bayVaoTui(tu: HTMLElement, chon = '[data-dich-tui]') {
  if (giamChuyenDong()) return;
  const den = dichDen(chon);
  if (!den) return;
  const a = tu.getBoundingClientRect();
  const b = den.getBoundingClientRect();
  const x0 = a.left + a.width / 2;
  const y0 = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - x0;
  const dy = b.top + b.height / 2 - y0;

  const cham = document.createElement('div');
  cham.setAttribute('aria-hidden', 'true');
  Object.assign(cham.style, {
    position: 'fixed',
    left: `${x0 - 7}px`,
    top: `${y0 - 7}px`,
    width: '14px',
    height: '14px',
    borderRadius: '9999px',
    background: 'rgb(var(--accent))',
    boxShadow: '0 2px 8px rgba(201, 42, 98, 0.45)',
    zIndex: '70',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(cham);

  // Đường cong: đi ngang đều, đi dọc nhấc lên trước rồi rơi xuống (theo 2 trục).
  const anim = cham.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(1.1)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5)`, opacity: 0.6 },
    ],
    { duration: 600, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
  );
  const xong = () => cham.remove();
  anim.onfinish = xong;
  anim.oncancel = xong;
}

/** Pháo nhỏ bung ra quanh một phần tử (dùng lúc túi vừa đủ mốc ưu đãi). */
export function phaoTai(el: HTMLElement) {
  if (giamChuyenDong()) return;
  const r = el.getBoundingClientRect();
  const mau = ['#C92A62', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FBBF24', '#8B5CF6'];
  for (let i = 0; i < 14; i++) {
    const goc = (i / 14) * Math.PI * 2;
    const xa = 40 + (i % 3) * 16;
    const c = document.createElement('div');
    c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, {
      position: 'fixed',
      left: `${r.left + r.width / 2 - 4}px`,
      top: `${r.top + r.height / 2 - 4}px`,
      width: '8px',
      height: '8px',
      borderRadius: '9999px',
      background: mau[i % mau.length],
      zIndex: '70',
      pointerEvents: 'none',
    } satisfies Partial<CSSStyleDeclaration>);
    document.body.appendChild(c);
    const a = c.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(goc) * xa}px, ${Math.sin(goc) * xa}px) scale(0.4)`, opacity: 0 },
      ],
      { duration: 800, easing: 'cubic-bezier(0.15, 0.7, 0.3, 1)' },
    );
    a.onfinish = () => c.remove();
    a.oncancel = () => c.remove();
  }
}
