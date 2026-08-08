import type { Metadata } from 'next';
import { FavoritesPageClient } from '@/components/FavoritesPageClient';

export const metadata: Metadata = {
  title: 'Mẫu yêu thích',
  // Nội dung trang này khác nhau tuỳ trình duyệt từng khách (lưu trong localStorage,
  // không có gì "chung" để Google index) -> không cho index, tránh trang rỗng bị lập chỉ mục.
  robots: { index: false, follow: true },
};

export default function YeuThichPage() {
  return (
    <div className="container-content py-14">
      <h1 className="font-serif text-3xl text-accent-dark sm:text-4xl">
        Mẫu yêu thích
      </h1>
      <p className="mt-2 text-muted">
        Danh sách được lưu trên trình duyệt này — không cần đăng nhập.
      </p>
      <div className="mt-8">
        <FavoritesPageClient />
      </div>
    </div>
  );
}
