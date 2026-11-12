import type { Metadata } from 'next';
import { TuiDoView } from '@/components/TuiDoView';

export const metadata: Metadata = {
  title: 'Túi đồ muốn thuê',
  description: 'Gom các mẫu bạn thích và gửi cả danh sách cho Sherent chỉ với một tin nhắn.',
  // Trang riêng của từng khách (lưu trên máy) — không cho Google lập chỉ mục.
  robots: { index: false, follow: true },
  alternates: { canonical: '/tui-do' },
};

export default function TuiDoPage() {
  return (
    <section className="container-content pb-16 pt-6 sm:pt-10">
      <h1 className="text-3xl text-ink sm:text-4xl">Túi đồ muốn thuê</h1>
      <p className="mb-6 mt-2 text-sm text-muted">
        Gom mẫu bạn thích rồi gửi cả danh sách cho tiệm một lần.
      </p>
      <TuiDoView />
    </section>
  );
}
