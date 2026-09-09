'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksTzTimeline } from '../../tina/__generated__/types';

/**
 * ORIGINS — the dated record. This section is the provenance evidence, so dates
 * are set in monospace and given more weight than the prose around them.
 */
export const TzTimeline = ({ data }: { data: PageBlocksTzTimeline }) => {
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

          <ol className='mt-12 border-l tz-rule'>
            {data.entries?.map((entry, i) => (
              <li key={`${entry?.date}-${i}`} className='relative pb-12 pl-8 last:pb-0'>
                <span
                  aria-hidden='true'
                  className='absolute left-0 top-[0.45rem] size-[7px] -translate-x-1/2 rotate-45 bg-[var(--tz-gold)]'
                />
                <p className='tz-mono text-[var(--tz-gold)]' data-tina-field={tinaField(entry, 'date')}>
                  {entry?.date}
                </p>
                {entry?.title && (
                  <h3
                    className='tz-display mt-2 text-2xl text-[var(--tz-parchment)]'
                    data-tina-field={tinaField(entry, 'title')}
                  >
                    {entry.title}
                  </h3>
                )}
                {entry?.text && (
                  <p
                    className='tz-prose mt-3 max-w-xl text-[1.0625rem]'
                    data-tina-field={tinaField(entry, 'text')}
                  >
                    {entry.text}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export const tzTimelineBlockSchema: Template = {
  name: 'tzTimeline',
  label: 'TZ — Timeline',
  ui: {
    defaultItem: { label: 'Origins', heading: 'Origins' },
    itemProps: (item) => ({ label: item?.heading || 'Timeline' }),
  },
  fields: [
    { type: 'string', label: 'Label (small, monospace)', name: 'label' },
    { type: 'string', label: 'Heading', name: 'heading' },
    {
      type: 'object',
      label: 'Entries',
      name: 'entries',
      list: true,
      ui: {
        itemProps: (item) => ({ label: [item?.date, item?.title].filter(Boolean).join(' — ') }),
        defaultItem: { date: 'May 2025', title: 'The writing begins' },
      },
      fields: [
        { type: 'string', label: 'Date', name: 'date' },
        { type: 'string', label: 'Title', name: 'title' },
        { type: 'string', label: 'Text', name: 'text', ui: { component: 'textarea' } },
      ],
    },
  ],
};
