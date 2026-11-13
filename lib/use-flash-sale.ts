'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import { chonMauFlash, dinhDangConLai, dotHienTai, ketThucDot } from '@/lib/flash-sale';

/**
 * Số đợt flash sale hiện tại, tính ở trình duyệt (trang là trang tĩnh nên giờ
 * lúc dựng trang không phải giờ khách xem). `null` trước khi gắn kết để server
 * và lần vẽ đầu khớp nhau. Tự sang đợt mới đúng lúc hết giờ.
 */
export function useDotFlash(): number | null {
  const [dot, setDot] = useState<number | null>(null);
  useEffect(() => {
    let hen: ReturnType<typeof setTimeout>;
    const dat = () => {
      const d = dotHienTai();
      setDot(d);
      // setTimeout tối đa ~24,8 ngày; một đợt chỉ 48 giờ nên luôn vừa.
      hen = setTimeout(dat, ketThucDot(d) - Date.now() + 500);
    };
    dat();
    return () => clearTimeout(hen);
  }, []);
  return dot;
}

/** Mã các mẫu flash sale đợt này (rỗng trước khi gắn kết). */
export function useMauFlash(products: Pick<Product, 'id' | 'sale'>[]): { dot: number | null; ids: Set<string> } {
  const dot = useDotFlash();
  const ids = useMemo(() => (dot === null ? new Set<string>() : chonMauFlash(products, dot)), [products, dot]);
  return { dot, ids };
}

/** Thời gian còn lại của đợt, cập nhật mỗi giây. */
export function useConLai(dot: number | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (dot === null || now === null) return null;
  return dinhDangConLai(ketThucDot(dot) - now);
}
