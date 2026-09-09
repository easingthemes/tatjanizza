'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PageBlocksTzHero } from '../../tina/__generated__/types';

export const TzHero = ({ data }: { data: PageBlocksTzHero }) => {
  return (
    <section className='tz-glow relative -mt-20 overflow-hidden border-b tz-rule'>
      {data.image?.src && (
        <div className='absolute inset-0 -z-10'>
          <Image
            src={data.image.src}
            alt={data.image.alt || ''}
            fill
            priority
            sizes='100vw'
            className='object-cover object-center opacity-40'
            data-tina-field={tinaField(data.image, 'src')}
          />
          {/* Keep the type readable over any cover: the covers are bright at the horizon. */}
          <div className='absolute inset-0 bg-gradient-to-t from-[var(--tz-void)] via-[var(--tz-void)]/75 to-[var(--tz-void)]/40' />
        </div>
      )}

      <div className='mx-auto flex min-h-[78svh] max-w-5xl flex-col justify-end px-6 pb-20 pt-40 sm:pb-28'>
        {data.eyebrow && (
          <p className='tz-mono tz-rise' data-tina-field={tinaField(data, 'eyebrow')}>
            {data.eyebrow}
          </p>
        )}

        <h1
          className='tz-display tz-rise mt-6 text-[clamp(2.75rem,9vw,7rem)] text-[var(--tz-parchment)]'
          data-tina-field={tinaField(data, 'name')}
        >
          {data.name}
        </h1>

        {data.tagline && (
          <p
            className='tz-rise mt-5 max-w-2xl text-lg text-[var(--tz-gold)] sm:text-xl'
            data-tina-field={tinaField(data, 'tagline')}
          >
            {data.tagline}
          </p>
        )}

        {data.intro && (
          <div className='tz-prose tz-rise mt-8 max-w-2xl' data-tina-field={tinaField(data, 'intro')}>
            <TinaMarkdown content={data.intro} />
          </div>
        )}

        {data.actions && data.actions.length > 0 && (
          <div className='tz-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4'>
            {data.actions.map((action, i) => (
              <Link
                key={`${action?.label}-${i}`}
                href={action?.link || '#'}
                className='tz-mono border-b border-[var(--tz-rule)] pb-1 text-[var(--tz-gold)] transition-colors hover:border-[var(--tz-gold)] hover:text-[var(--tz-parchment)]'
                data-tina-field={tinaField(action, 'label')}
              >
                {action?.label} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const tzHeroBlockSchema: Template = {
  name: 'tzHero',
  label: 'TZ — Hero',
  ui: {
    defaultItem: {
      eyebrow: 'Music, language, deep time, artificial intelligence',
      name: 'Tatjanizza',
    },
  },
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Name', name: 'name' },
    { type: 'string', label: 'Tagline', name: 'tagline' },
    { type: 'rich-text', label: 'Intro', name: 'intro' },
    {
      type: 'object',
      label: 'Background image',
      name: 'image',
      fields: [
        { name: 'src', label: 'Image', type: 'image' },
        { name: 'alt', label: 'Alt text', type: 'string' },
      ],
    },
    {
      type: 'object',
      label: 'Links',
      name: 'actions',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.label }),
        defaultItem: { label: 'Listen on Spotify', link: '#' },
      },
      fields: [
        { type: 'string', label: 'Label', name: 'label' },
        { type: 'string', label: 'Link', name: 'link' },
      ],
    },
  ],
};
