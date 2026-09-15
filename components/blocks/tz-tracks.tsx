'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksTzTracks } from '../../tina/__generated__/types';

/**
 * SELECTED WORKS.
 *
 * Two language fields on purpose. Every song is sung in Serbian or English; the
 * historical language appears in parts inside it — chorus, chant, whisper. A single
 * "Title — Akkadian" line would read as if the whole song were in Akkadian, which
 * would be wrong on a page whose whole point is an accurate record.
 */
export const TzTracks = ({ data }: { data: PageBlocksTzTracks }) => {
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

          {data.note && (
            <p className='tz-prose mt-4 text-[1.0625rem]' data-tina-field={tinaField(data, 'note')}>
              {data.note}
            </p>
          )}

          <ul className='mt-12 border-t tz-rule'>
            {data.tracks?.map((track, i) => {
              const Title = track?.link ? 'a' : 'span';
              return (
                <li key={`${track?.title}-${i}`} className='border-b tz-rule py-7'>
                  <div className='flex flex-wrap items-baseline gap-x-4 gap-y-2'>
                    <span aria-hidden='true' className='tz-mono text-[var(--tz-gold-dim)]'>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Title
                      {...(track?.link ? { href: track.link, target: '_blank', rel: 'noreferrer' } : {})}
                      className='tz-display text-[clamp(1.5rem,2.6vw,2rem)] text-[var(--tz-parchment)] transition-colors hover:text-[var(--tz-gold)]'
                      data-tina-field={tinaField(track, 'title')}
                    >
                      {track?.title}
                    </Title>
                  </div>

                  <div className='mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 pl-0 sm:pl-10'>
                    {track?.sungIn && (
                      <span className='tz-mono' data-tina-field={tinaField(track, 'sungIn')}>
                        Sung in {track.sungIn}
                      </span>
                    )}
                    {track?.ancientLayer && (
                      <span className='tz-mono text-[var(--tz-ember)]' data-tina-field={tinaField(track, 'ancientLayer')}>
                        {track.ancientLayer} within
                      </span>
                    )}
                    {track?.released && (
                      <span className='tz-mono' data-tina-field={tinaField(track, 'released')}>
                        {track.released}
                      </span>
                    )}
                  </div>

                  {track?.gloss && (
                    <p
                      className='tz-prose mt-3 max-w-xl pl-0 text-[1.0625rem] sm:pl-10'
                      data-tina-field={tinaField(track, 'gloss')}
                    >
                      {track.gloss}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const tzTracksBlockSchema: Template = {
  name: 'tzTracks',
  label: 'TZ — Selected works',
  ui: {
    defaultItem: { label: 'Selected works', heading: 'Selected works' },
    itemProps: (item) => ({ label: item?.heading || 'Selected works' }),
  },
  fields: [
    { type: 'string', label: 'Label (small, monospace)', name: 'label' },
    { type: 'string', label: 'Heading', name: 'heading' },
    {
      type: 'string',
      label: 'Note above the list',
      name: 'note',
      ui: { component: 'textarea' },
      description: 'Explain that the historical language appears inside the song, not instead of it.',
    },
    {
      type: 'object',
      label: 'Tracks',
      name: 'tracks',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title }),
        defaultItem: { title: 'New track', sungIn: 'Serbian' },
      },
      fields: [
        { type: 'string', label: 'Title', name: 'title' },
        { type: 'string', label: 'Sung in', name: 'sungIn', description: 'Serbian or English.' },
        {
          type: 'string',
          label: 'Historical language within',
          name: 'ancientLayer',
          description: 'The language that appears in parts of the song — chorus, chant, whisper.',
        },
        { type: 'string', label: 'Released', name: 'released' },
        { type: 'string', label: 'Gloss', name: 'gloss', ui: { component: 'textarea' } },
        { type: 'string', label: 'Link', name: 'link' },
      ],
    },
  ],
};
