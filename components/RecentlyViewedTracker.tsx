'use client';

import { useEffect } from 'react';
import { recordRecentlyViewed } from '@/lib/useRecentlyViewed';

/** Không render gì — chỉ ghi nhận slug hiện tại vào lịch sử "đã xem gần đây". */
export function RecentlyViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordRecentlyViewed(slug);
  }, [slug]);
  return null;
}
