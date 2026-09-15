'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksTzCredits } from '../../tina/__generated__/types';

/**
 * The provenance block. Deliberately plain and machine-readable: a record, not a pitch.
 * Everything here must be a verified fact — no guessed dates.
 */
export const TzCredits = ({ data }: { data: PageBlocksTzCredits }) => {
  return (
    <section>
      <div className='mx-auto grid max-w-5xl gap-y-6 px-6 py-20 sm:py-24 md:grid-cols-[13rem_1fr] md:gap-x-12'>
        <div className='md:pt-3'>
          {data.label && (
            <p className='tz-mono' data-tina-field={tinaField(data, 'label')}>
              {data.label}
            </p>
          )}
        </div>

        <div>
          <dl className='grid gap-x-8 gap-y-4 sm:grid-cols-[14rem_1fr]'>
            {data.entries?.map((entry, i) => (
              <React.Fragment key={`${entry?.term}-${i}`}>
                <dt className='tz-mono pt-1' data-tina-field={tinaField(entry, 'term')}>
                  {entry?.term}
                </dt>
                <dd
                  className='font-[family-name:var(--font-mono)] text-[0.9375rem] text-[var(--tz-parchment)]'
                  data-tina-field={tinaField(entry, 'value')}
                >
                  {entry?.value}
                </dd>
              </React.Fragment>
            ))}
          </dl>

          {data.copyright && (
            <p
              className='tz-mono mt-10 border-t tz-rule pt-6'
              data-tina-field={tinaField(data, 'copyright')}
            >
              {data.copyright}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export const tzCreditsBlockSchema: Template = {
  name: 'tzCredits',
  label: 'TZ — Credits & provenance',
  ui: {
    defaultItem: { label: 'Provenance', copyright: '© 2026 Tatjanizza' },
    itemProps: () => ({ label: 'Credits & provenance' }),
  },
  fields: [
    { type: 'string', label: 'Label (small, monospace)', name: 'label' },
    {
      type: 'object',
      label: 'Entries',
      name: 'entries',
      list: true,
      ui: {
        itemProps: (item) => ({ label: [item?.term, item?.value].filter(Boolean).join(': ') }),
        defaultItem: { term: 'First published', value: '' },
      },
      fields: [
        { type: 'string', label: 'Term', name: 'term' },
        { type: 'string', label: 'Value', name: 'value' },
      ],
    },
    { type: 'string', label: 'Copyright', name: 'copyright' },
  ],
};
