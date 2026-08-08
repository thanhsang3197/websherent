import { NextResponse } from 'next/server';

export async function GET() {
  const products = [
    {
      id: 'T168',
      slug: 'nathalia-dress-t168',
      name: 'Nathalia Dress (Demo WebApp Nội Bộ)',
      brand: 'Those studios',
      category: 'dam-vay',
      sizes: ['S', 'M'],
      rentPrice: 210000,
      depositPrice: 600000,
      image: 'https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg',
      images: ['https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg'],
    },
    {
      id: 'AD025',
      slug: 'ao-dai-wayo-ad025',
      name: 'Áo dài Wayo Trắng (Demo WebApp Nội Bộ)',
      brand: 'Sherent Design',
      category: 'ao-dai',
      sizes: ['S', 'M', 'L'],
      rentPrice: 150000,
      depositPrice: 400000,
      image: 'https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg',
      images: ['https://raw.githubusercontent.com/thanhsang3197/sherent-hinhanh/main/vay_thiet_ke_serena.jpg'],
    },
  ];

  return NextResponse.json(products);
}
