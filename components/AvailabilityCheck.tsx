'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { ContactButtons } from '@/components/ContactButtons';

export function AvailabilityCheck({ product }: { product: Product }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultToDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState<string>(todayStr);
  const [toDate, setToDate] = useState<string>(defaultToDate);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    checked: boolean;
    available?: boolean;
    error?: string;
  }>({ checked: false });

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) return;

    if (fromDate > toDate) {
      setStatus({ checked: true, error: 'Ngày trả phải sau hoặc cùng ngày nhận đồ.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/kiem-tra-lich?id=${encodeURIComponent(product.id)}&from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`
      );
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStatus({ checked: true, available: data.available });
      } else {
        setStatus({ checked: true, error: data.error || 'Có lỗi xảy ra.' });
      }
    } catch {
      setLoading(false);
      setStatus({ checked: true, error: 'Không thể kết nối máy chủ kiểm tra lịch.' });
    }
  };

  return (
    <section
      aria-labelledby="lich-trong-title"
      className="rounded-3xl glass-card p-6 shadow-glass"
    >
      <div className="flex items-center gap-2">
        <CalendarIcon />
        <h2 id="lich-trong-title" className="font-serif text-lg font-semibold text-accent-dark">
          Kiểm tra lịch trống mẫu này
        </h2>
        <span className="glass-pill ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-accent-dark shadow-sm">
          Trực tiếp
        </span>
      </div>

      <p className="mt-2 text-xs text-muted">
        Chọn ngày bạn cần nhận và trả đồ để kiểm tra mẫu <strong>{product.name}</strong> (mã {product.id}) có còn trống lịch không:
      </p>

      <form onSubmit={handleCheck} className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium text-ink">
            Ngày nhận đồ
            <input
              type="date"
              value={fromDate}
              min={todayStr}
              onChange={(e) => setFromDate(e.target.value)}
              required
              className="mt-1 w-full rounded-xl glass-input px-3 py-2.5 text-sm text-ink focus-visible:outline-none"
            />
          </label>
          <label className="block text-xs font-medium text-ink">
            Ngày trả đồ
            <input
              type="date"
              value={toDate}
              min={fromDate || todayStr}
              onChange={(e) => setToDate(e.target.value)}
              required
              className="mt-1 w-full rounded-xl glass-input px-3 py-2.5 text-sm text-ink focus-visible:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center py-2.5 text-sm"
        >
          {loading ? 'Đang kiểm tra...' : '🔍 Kiểm tra ngày này'}
        </button>
      </form>

      {/* Result Display */}
      {status.checked && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-1">
          {status.error ? (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">
              ⚠️ {status.error}
            </div>
          ) : status.available ? (
            <div className="rounded-xl border border-green-200 bg-green-50/80 p-4 text-sm text-green-900">
              <p className="font-semibold text-green-800">
                ✨ Mẫu này ĐANG TRỐNG LỊCH từ {formatDateDisplay(fromDate)} đến {formatDateDisplay(toDate)}!
              </p>
              <p className="mt-1 text-xs text-green-700">
                Bạn có thể nhắn Zalo giữ ngày này ngay trước khi có người khác đặt.
              </p>
              <ContactButtons
                className="mt-3"
                zaloLabel="Giữ ngày này qua Zalo"
                contextLabel={`${product.name} (mã ${product.id}) từ ${formatDateDisplay(fromDate)} đến ${formatDateDisplay(toDate)}`}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
              <p className="font-semibold text-amber-800">
                ⚠️ Mẫu này đã có khách khác đặt trùng lịch khoảng ngày này.
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Vui lòng thử chọn khoảng ngày khác hoặc nhắn Zalo để tiệm tư vấn mẫu tương tự còn trống.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function formatDateDisplay(d: string): string {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
