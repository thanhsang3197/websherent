import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/bai-viet/${post.slug}`} className="group block">
      {post.coverImage && (
        <div className="arch relative aspect-[16/10] overflow-hidden bg-tint ring-1 ring-hairline transition group-hover:ring-accent/40">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          />
        </div>
      )}
      <div className={post.coverImage ? 'mt-3' : ''}>
        <p className="flex items-center gap-2 text-xs text-muted">
          {formatDate(post.publishedAt)}
          {post.tiktokUrl && (
            <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] font-medium text-accent-dark">
              🎬 Video
            </span>
          )}
        </p>
        <h2 className="mt-1 font-serif text-xl text-ink transition-colors group-hover:text-accent-dark">
          {post.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
