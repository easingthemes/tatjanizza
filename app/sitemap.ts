import type { MetadataRoute } from 'next';
import client from '@/tina/__generated__/client';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

/**
 * Lists the pages in the `page` collection, honouring the same `home` → `/` rule the
 * Tina router uses. Posts are deliberately absent: the `post` collection still holds
 * the unmodified TinaCMS starter tutorials, and listing those would tell search
 * engines this site is a CMS demo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let pages = await client.queries.pageConnection();
  const edges = [...(pages.data.pageConnection.edges ?? [])];

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    });
    if (!pages.data.pageConnection.edges) break;
    edges.push(...pages.data.pageConnection.edges);
  }

  return edges
    .filter((edge) => !(edge?.node as any)?.seo?.noindex)
    .map((edge) => {
      const segments = edge?.node?._sys.breadcrumbs ?? [];
      const isHome = segments.length === 1 && segments[0] === 'home';
      const path = isHome ? '/' : `/${segments.join('/')}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: isHome ? 1 : 0.8,
      };
    });
}
