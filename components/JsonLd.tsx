/**
 * Render một khối JSON-LD (schema.org) an toàn vào <head>/<body>.
 * Server Component — không cần 'use client'.
 */
export function JsonLd({
  data,
  id,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Dữ liệu do server tạo từ dữ liệu của chính tiệm, không phải input người dùng.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
