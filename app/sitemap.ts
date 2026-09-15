import type { MetadataRoute } from 'next';
import client from '@/tina/__generated__/client';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

/** Collects every page document's breadcrumbs, following the connection cursors. */
async function allPageBreadcrumbs(): Promise<string[][]> {
  let pages = await client.queries.pageConnection();
  const edges = [...(pages.data.pageConnection.edges ?? [])];

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    });
    if (!pages.data.pageConnection.edges) break;
    edges.push(...pages.data.pageConnection.edges);
  }

  return edges.map((edge) => edge?.node?._sys.breadcrumbs ?? []).filter((crumbs) => crumbs.length > 0);
}

/**
 * Lists the pages in the `page` collection, honouring the same `home` → `/` rule the
 * Tina router uses, and skipping anything marked noindex.
 *
 * The noindex check needs a second query per page: `pageConnection` returns only each
 * document's `_sys` fields, never its content, so reading `seo` off a connection edge
 * silently yields undefined and every page ends up listed.
 *
 * Posts are deliberately absent: the `post` collection still holds the unmodified
 * TinaCMS starter tutorials, and listing those would tell search engines this site is
 * a CMS demo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const breadcrumbs = await allPageBreadcrumbs();

  const entries = await Promise.all(
    breadcrumbs.map(async (crumbs) => {
      const { data } = await client.queries.page({ relativePath: `${crumbs.join('/')}.mdx` });
      if (data.page.seo?.noindex) return null;

      const isHome = crumbs.length === 1 && crumbs[0] === 'home';
      const path = isHome ? '/' : `/${crumbs.join('/')}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: isHome ? 1 : 0.8,
      };
    })
  );

  return entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}
