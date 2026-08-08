import { NextResponse } from 'next/server';
import { isProductAvailable } from '@/lib/orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!id || !from || !to) {
    return NextResponse.json(
      { error: 'Thiếu thông số id, from hoặc to' },
      { status: 400 },
    );
  }

  const result = isProductAvailable(id, from, to);
  return NextResponse.json(result);
}
