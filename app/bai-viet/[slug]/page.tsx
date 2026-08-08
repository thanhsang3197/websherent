import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost } from '@/lib/blog';
import { siteConfig, SITE_URL } from '@/lib/site-config';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ContactButtons } from '@/components/ContactButtons';
import { TikTokEmbed } from '@/components/TikTokEmbed';
import { resolveTikTokVideoId } from '@/lib/tiktok';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/bai-viet/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/bai-viet/${post.slug}`,
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage ?? siteConfig.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage ?? siteConfig.ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const tiktokVideoId = post.tiktokUrl
    ? await resolveTikTokVideoId(post.tiktokUrl)
    : null;

  const postUrl = `${SITE_URL}/bai-viet/${post.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Trang chủ', url: `${SITE_URL}/` },
    { name: 'Bài viết', url: `${SITE_URL}/bai-viet` },
    { name: post.title, url: postUrl },
  ]);

  return (
    <article className="container-content py-10">
      <JsonLd data={articleJsonLd({ ...post, url: postUrl })} id="ld-article" />
      <JsonLd data={breadcrumb} id="ld-breadcrumb-article" />

      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-accent">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/bai-viet" className="hover:text-accent">
              Bài viết
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 text-ink">{post.title}</li>
        </ol>
      </nav>

      <header className="mx-auto mt-6 max-w-2xl">
        <p className="text-xs text-muted">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-2 font-serif text-3xl text-accent-dark sm:text-4xl">
          {post.title}
        </h1>
      </header>

      {post.coverImage && (
        <div className="arch relative mx-auto mt-8 aspect-[16/9] w-full max-w-2xl overflow-hidden bg-tint">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.tiktokUrl && (
        <div className="mt-8">
          <TikTokEmbed url={post.tiktokUrl} videoId={tiktokVideoId} />
        </div>
      )}

      <div className="mx-auto mt-8 max-w-2xl space-y-5 leading-relaxed text-ink/90">
        {post.blocks.map((block, i) => {
          if (block.type === 'heading') {
            return (
              <h2 key={i} className="font-serif text-2xl text-accent-dark">
                {block.text}
              </h2>
            );
          }
          if (block.type === 'list') {
            return (
              <ul key={i} className="list-disc space-y-2 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{block.text}</p>;
        })}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-hairline bg-surface p-6">
        <h2 className="font-serif text-2xl text-accent-dark">
          Xem bộ sưu tập {siteConfig.name}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Tìm mẫu ưng ý và nhắn Zalo để giữ mẫu nhanh chóng.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/#san-pham" className="btn btn-primary">
            Xem bộ sưu tập
          </Link>
        </div>
        <ContactButtons className="mt-4" />
      </div>
    </article>
  );
}
