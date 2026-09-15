import type { Metadata } from 'next';

export const SITE_URL = 'https://www.tatjanizza.com';
export const SITE_NAME = 'Tatjanizza';
export const SITE_DESCRIPTION =
  'Music in ancient and modern tongues — Akkadian, Phoenician, Old Norse, Sanskrit, Old Greek, Hebrew, Welsh and Serbian.';

/** Fallback share image. Square, so it is declared as such rather than lied about as 1200x630. */
export const DEFAULT_OG_IMAGE = { url: '/uploads/posts/main.jpg', width: 1024, height: 1024 };

type PageSeo = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  noindex?: boolean | null;
} | null;

/**
 * Builds per-route metadata from a Tina page document.
 *
 * Every field is optional in the CMS, so each one falls back to the site default —
 * a page with an empty SEO group still gets a correct canonical URL and share card.
 */
export function pageMetadata({
  seo,
  title,
  path,
}: {
  seo?: PageSeo;
  title?: string | null;
  path: string;
}): Metadata {
  const resolvedTitle = seo?.title || title || SITE_NAME;
  const description = seo?.description || SITE_DESCRIPTION;
  const image = seo?.image ? { url: seo.image } : DEFAULT_OG_IMAGE;
  const url = path === '/' ? '/' : path;

  return {
    // `title.absolute` skips the "%s | Tatjanizza" template — the home page is already
    // called Tatjanizza, and the project page carries the artist name in its own SEO title.
    title: { absolute: resolvedTitle },
    description,
    alternates: { canonical: url },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: resolvedTitle,
      description,
      url,
      locale: 'en_US',
      images: [{ ...image, alt: resolvedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [image.url],
    },
  };
}
