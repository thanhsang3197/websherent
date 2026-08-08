import { NextResponse } from 'next/server';

export async function GET() {
  const orders = [
    {
      orderId: 'ORD-2026-001',
      productId: 'T168',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      status: 'Đã cọc',
    },
    {
      orderId: 'ORD-2026-002',
      productId: 'AD025',
      startDate: '2026-08-20',
      endDate: '2026-08-22',
      status: 'Đang thuê',
    },
  ];

  return NextResponse.json(orders);
}
