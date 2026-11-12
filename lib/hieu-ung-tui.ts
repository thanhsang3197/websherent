'use client';

import { PHAN_TRAM_GIAM, SO_MAU_GIAM, tamTinh, type MonTrongTui } from '@/lib/tui-do-mon';
import { bayVaoTui, phaoTai, thongBao } from '@/lib/hieu-ung';

const LINK_TUI = { nhan: 'Xem túi', href: '/tui-do' };

/**
 * Hiệu ứng sau khi khách THÊM một món vào túi (nút ♡ và nút "Thêm vào túi"):
 * chấm bay vào biểu tượng túi + thông báo. Nếu món này làm túi VỪA đủ mốc
 * ưu đãi -> bắn pháo tại nút và đổi câu thông báo — đây là lúc khách đạt mốc,
 * nên mừng ngay tại chỗ chứ không đợi họ mở trang túi đồ.
 */
export function hieuUngThemVaoTui(el: HTMLElement, mon: MonTrongTui, tuiTruoc: MonTrongTui[]) {
  bayVaoTui(el);
  const vuaDu = !tamTinh(tuiTruoc).duGiam && tamTinh([...tuiTruoc, mon]).duGiam;
  if (vuaDu) {
    phaoTai(el);
    thongBao({ noiDung: `Đủ ${SO_MAU_GIAM} mẫu — được giảm ${PHAN_TRAM_GIAM}%!`, link: LINK_TUI });
  } else {
    thongBao({ noiDung: `Đã thêm ${mon.name} vào túi`, link: LINK_TUI });
  }
}
