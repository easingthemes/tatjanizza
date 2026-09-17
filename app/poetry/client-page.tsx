'use client';
import React from 'react';
import Link from 'next/link';
import { useTina } from 'tinacms/dist/react';

/**
 * Poetry First: titles and nothing else.
 *
 * The point of the page is that the poem came before the voice and before the machine,
 * so the index does not summarise, excerpt or explain. It lists what exists and gets
 * out of the way.
 */
export default function PoetryClientPage(props: { data: any; variables: any; query: string }) {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data });
  const poems = (data.poemConnection?.edges ?? [])
    .map((edge: any) => edge?.node)
    .filter(Boolean)
    .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <section className='border-b tz-rule'>
      <div className='mx-auto max-w-5xl px-6 py-24 sm:py-32'>
        <p className='tz-mono'>Poetry first</p>

        <h1 className='tz-display mt-4 text-[clamp(2.2rem,6vw,4rem)] text-[var(--tz-parchment)]'>Poetry First</h1>

        <p className='tz-prose mt-6 max-w-xl text-[1.125rem] italic'>
          Before the voice. Before the machine. There was the poem.
        </p>

        <ul className='mt-16 border-t tz-rule'>
          {poems.map((poem: any) => (
            <li key={poem.id} className='border-b tz-rule'>
              <Link href={`/poetry/${poem._sys.breadcrumbs.join('/')}`} className='group block py-7'>
                <span className='tz-display text-[clamp(1.5rem,3vw,2.25rem)] text-[var(--tz-parchment)] transition-colors group-hover:text-[var(--tz-gold)]'>
                  {poem.title}
                </span>
                {poem.subtitle && <span className='tz-prose ml-4 text-[1.0625rem]'>{poem.subtitle}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
