/**
 * Builder JSON-LD (schema.org) cho SEO & GEO — để search engine và AI hiểu tiệm.
 * Dùng cùng components/JsonLd.tsx để render <script type="application/ld+json">.
 */

import type { Product } from '../types/product';
import { CATEGORY_LABELS } from '../types/product';
import { siteConfig, SITE_URL, mapsCidUrl } from './site-config';

type Json = Record<string, unknown>;

/** URL tuyệt đối từ path tương đối. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** LocalBusiness (ClothingStore) — đặt ở trang chủ/layout. */
export function localBusinessJsonLd(): Json {
  const { address, openingHours, geo } = siteConfig;

  const data: Json = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${SITE_URL}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    image: absoluteUrl(siteConfig.ogImage),
    logo: absoluteUrl('/icon-512.png'),
    hasMap: mapsCidUrl,
    telephone: siteConfig.phone.tel,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: 'VND',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.district,
      addressRegion: address.region,
      addressCountry: address.country,
    },
    areaServed: siteConfig.areaServed.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: openingHours.days,
        opens: openingHours.opens,
        closes: openingHours.closes,
      },
    ],
    sameAs: [
      siteConfig.zaloUrl,
      siteConfig.facebookUrl,
      siteConfig.instagramUrl,
      siteConfig.instagramUrl2,
      siteConfig.tiktokUrl,
      mapsCidUrl,
    ],
  };

  if (geo) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    };
  }

  return data;
}

/**
 * WebSite — giúp Google hiện tên "Sherent" thay vì "vercel.app" trên kết quả
 * tìm kiếm (site name). Không có SearchAction: Google đã bỏ ô tìm kiếm
 * sitelinks từ 11/2024.
 */
export function websiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: siteConfig.name,
    alternateName: ['SHERENT', siteConfig.legalName],
    url: `${SITE_URL}/`,
    inLanguage: 'vi-VN',
    publisher: { '@id': `${SITE_URL}/#business` },
  };
}

/** Product + Offer (LeaseOut) cho trang chi tiết. */
export function productJsonLd(product: Product, productUrl: string): Json {
  const offer: Json = {
    '@type': 'Offer',
    priceCurrency: 'VND',
    availability: 'https://schema.org/InStock',
    businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
    url: productUrl,
    seller: { '@type': 'Organization', name: siteConfig.name },
  };
  if (product.rentPrice > 0) {
    offer.price = product.rentPrice;
  }

  const data: Json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.id,
    category: CATEGORY_LABELS[product.category],
    description: `Cho thuê ${product.name}${
      product.brand ? ` (${product.brand})` : ''
    } tại ${siteConfig.name}, ${siteConfig.address.district}, ${siteConfig.address.city}.`,
    offers: offer,
  };

  if (product.images.length === 1) data.image = product.images[0];
  else if (product.images.length > 1) data.image = product.images;
  if (product.brand) data.brand = { '@type': 'Brand', name: product.brand };
  if (product.sizes.length > 0) {
    const sizeValue = product.sizes.join(', ');
    data.size = sizeValue;
    data.additionalProperty = [
      { '@type': 'PropertyValue', name: 'Size', value: sizeValue },
    ];
  }

  return data;
}

/** BreadcrumbList. items theo thứ tự từ gốc -> hiện tại. */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Article — cho từng bài viết blog. */
export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  publishedAt: string;
  url: string;
  coverImage?: string;
}): Json {
  const data: Json = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: siteConfig.name, url: `${SITE_URL}/` },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png') },
    },
    mainEntityOfPage: post.url,
  };
  if (post.coverImage) data.image = post.coverImage;
  return data;
}

/**
 * FAQPage — giúp AI (ChatGPT/Gemini/Claude...) đọc đúng từng cặp hỏi–đáp và
 * trích dẫn đúng chính sách tiệm. Google ĐÃ NGỪNG hiện rich result FAQ từ
 * 05/2026, nên đừng kỳ vọng câu trả lời bung ra trên trang kết quả Google; vẫn
 * giữ vì nó mô tả đúng nội dung đang hiện trên trang.
 */
export function faqJsonLd(items: { question: string; answer: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
