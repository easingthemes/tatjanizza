import type { Collection } from 'tinacms';
import { heroBlockSchema } from '@/components/blocks/hero';
import { contentBlockSchema } from '@/components/blocks/content';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { featureBlockSchema } from '@/components/blocks/features';
import { videoBlockSchema } from '@/components/blocks/video';
import { calloutBlockSchema } from '@/components/blocks/callout';
import { statsBlockSchema } from '@/components/blocks/stats';
import { ctaBlockSchema } from '@/components/blocks/call-to-action';
import { tzHeroBlockSchema } from '@/components/blocks/tz-hero';
import { tzProseBlockSchema } from '@/components/blocks/tz-prose';
import { tzTimelineBlockSchema } from '@/components/blocks/tz-timeline';
import { tzTracksBlockSchema } from '@/components/blocks/tz-tracks';
import { tzCreditsBlockSchema } from '@/components/blocks/tz-credits';
import { seoSchemaField } from '@/tina/fields/seo';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');
      if (filepath === 'home') {
        return '/';
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Page title',
      description: 'Used for the tab title and sharing when no SEO title is set.',
      isTitle: true,
      // Not required: a page hand-edited in git without a title would otherwise make
      // the whole `pageConnection` query fail and break the build, not just that page.
    },
    seoSchemaField,
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
      },
      templates: [
        tzHeroBlockSchema,
        tzProseBlockSchema,
        tzTimelineBlockSchema,
        tzTracksBlockSchema,
        tzCreditsBlockSchema,
        heroBlockSchema,
        calloutBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
      ],
    },
  ],
};

export default Page;
