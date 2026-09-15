import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The Tina admin bundle and its auth callback are not content.
        disallow: ['/admin', '/exit-admin'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
