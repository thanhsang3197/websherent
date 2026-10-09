'use client';

import { useEffect } from 'react';
import { trackPhoneCopy } from '@/lib/analytics';

/**
 * Nghe sự kiện `copy` trên cả trang: chữ khách vừa chép mà là số điện thoại
 * thì ghi "Chép SĐT". Đặt MỘT lần ở layout — số điện thoại hiện ở footer,
 * Giới thiệu, Hỏi đáp…, gắn từng chỗ thì sẽ có chỗ bị sót.
 *
 * Nhận ra số điện thoại bằng cách bỏ mọi ký tự không phải chữ số: còn 10 số bắt
 * đầu bằng 0, hoặc 11 số bắt đầu bằng 84. Không so với đúng số của tiệm để
 * khỏi phải sửa ở đây mỗi lần tiệm đổi số — trên website này, chuỗi trông như
 * số điện thoại thì chỉ có thể là số của tiệm.
 *
 * Không render gì.
 */
export function TheoDoiChepSo() {
  useEffect(() => {
    const nghe = () => {
      const chu = window.getSelection()?.toString() ?? '';
      // Chép cả đoạn dài (cả khối footer) thì không tính là chép số.
      if (chu.length > 30) return;
      const so = chu.replace(/\D/g, '');
      if (!/^(0\d{9}|84\d{9})$/.test(so)) return;
      const doanDau = window.location.pathname.split('/')[1];
      trackPhoneCopy(doanDau ? `/${doanDau}` : '/');
    };
    document.addEventListener('copy', nghe);
    return () => document.removeEventListener('copy', nghe);
  }, []);
  return null;
}
