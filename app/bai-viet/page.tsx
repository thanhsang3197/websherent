import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { getSortedBlogPosts } from '@/lib/blog';
import { breadcrumbJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { BlogCard } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Bài viết & Mẹo chọn đồ',
  description: `Mẹo chọn đầm dự tiệc, áo dài, xu hướng theo mùa — chia sẻ từ ${siteConfig.name}.`,
  alternates: { canonical: '/bai-viet' },
};

export default function BlogListPage() {
  const posts = getSortedBlogPosts();
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: 'Bài viết', url: `${SITE_URL}/bai-viet` },
  ]);

  return (
    <div className="container-content py-14">
      <JsonLd data={breadcrumb} id="ld-breadcrumb-blog" />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink">Bài viết</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-accent-dark sm:text-5xl">
          Bài viết &amp; Mẹo chọn đồ
        </h1>
        <div className="rule-accent mt-5" />
        <p className="mt-4 text-muted">
          Mẹo chọn dáng đầm, phối áo dài theo mùa — chia sẻ từ {siteConfig.name}.
        </p>
      </header>

      <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
