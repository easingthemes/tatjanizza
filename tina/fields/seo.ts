import type { TinaField } from 'tinacms';

/**
 * Per-page SEO and sharing overrides.
 *
 * Without these every route inherits the root layout's title and description, so a
 * search engine sees one document called "Tatjanizza" instead of a home page and a
 * citable project page. That is the opposite of what this site is for.
 */
export const seoSchemaField: TinaField = {
  type: 'object',
  name: 'seo',
  label: 'SEO & sharing',
  description: 'Optional. Falls back to the site defaults when left empty.',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Search & tab title',
      description: 'Shown in the browser tab and in search results. Around 60 characters.',
    },
    {
      type: 'string',
      name: 'description',
      label: 'Meta description',
      description: 'The paragraph under the link in search results. Around 155 characters.',
      ui: { component: 'textarea' },
    },
    {
      type: 'image',
      name: 'image',
      label: 'Share image',
      description: 'Used when the page is posted to social media. 1200x630 works best.',
    },
    {
      type: 'boolean',
      name: 'noindex',
      label: 'Hide from search engines',
      description: 'Keeps the page off Google and out of the sitemap. Leave off for published pages.',
    },
  ],
};
