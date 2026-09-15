'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PageBlocksTzProse } from '../../tina/__generated__/types';

/**
 * A statement section: small monospace label, serif heading, prose.
 * Used for TWO MILLION YEARS, THE IDEA, LANGUAGE AS TIME and the rest.
 */
export const TzProse = ({ data }: { data: PageBlocksTzProse }) => {
  return (
    <section className='border-b tz-rule'>
      <div className='mx-auto grid max-w-5xl gap-y-6 px-6 py-20 sm:py-28 md:grid-cols-[13rem_1fr] md:gap-x-12'>
        <div className='md:pt-3'>
          {data.label && (
            <p className='tz-mono' data-tina-field={tinaField(data, 'label')}>
              {data.label}
            </p>
          )}
        </div>

        <div>
          {data.heading && (
            <h2
              className='tz-display text-[clamp(1.9rem,4vw,3rem)] text-[var(--tz-parchment)]'
              data-tina-field={tinaField(data, 'heading')}
            >
              {data.heading}
            </h2>
          )}

          {data.subheading && (
            <p className='mt-3 text-lg text-[var(--tz-gold-dim)]' data-tina-field={tinaField(data, 'subheading')}>
              {data.subheading}
            </p>
          )}

          {data.body && (
            <div
              className={`tz-prose ${data.heading || data.subheading ? 'mt-8' : ''}`}
              data-tina-field={tinaField(data, 'body')}
            >
              <TinaMarkdown content={data.body} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const tzProseBlockSchema: Template = {
  name: 'tzProse',
  label: 'TZ — Statement section',
  ui: {
    defaultItem: {
      label: 'The idea',
      heading: 'The project did not begin with generative music.',
    },
    itemProps: (item) => ({ label: item?.heading || item?.label }),
  },
  fields: [
    { type: 'string', label: 'Label (small, monospace)', name: 'label' },
    { type: 'string', label: 'Heading', name: 'heading' },
    { type: 'string', label: 'Subheading', name: 'subheading' },
    { type: 'rich-text', label: 'Body', name: 'body' },
  ],
};
