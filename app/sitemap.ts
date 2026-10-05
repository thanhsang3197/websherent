import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';
import { getAlbums, getFeedback, getProducts, getUuDai } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, albums, feedback, uuDai] = await Promise.all([
    getProducts(),
    getAlbums(),
    getFeedback(),
    getUuDai(),
  ]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    {
      url: `${SITE_URL}/thanh-ly`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/gioi-thieu`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/cau-hoi-thuong-gap`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Chưa có album nào thì bỏ luôn cả trang /album — khỏi mời Google vào một
  // trang "Hiện chưa có album nào".
  const albumRoutes: MetadataRoute.Sitemap =
    albums.length === 0
      ? []
      : [
          { url: `${SITE_URL}/album`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
          ...albums.map((a) => ({
            url: `${SITE_URL}/album/${a.slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          })),
        ];

  // Cùng lý do với album: chưa có feedback thì khỏi mời Google vào trang rỗng.
  const feedbackRoutes: MetadataRoute.Sitemap =
    feedback.length === 0
      ? []
      : [{ url: `${SITE_URL}/feedback`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 }];

  // Cùng lý do: không có chương trình nào thì khỏi mời Google vào trang rỗng.
  const uuDaiRoutes: MetadataRoute.Sitemap =
    uuDai.length === 0
      ? []
      : [{ url: `${SITE_URL}/uu-dai`, lastModified: now, changeFrequency: 'daily', priority: 0.6 }];

  return [...staticRoutes, ...albumRoutes, ...feedbackRoutes, ...uuDaiRoutes, ...productRoutes];
}
