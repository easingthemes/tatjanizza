'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTina } from 'tinacms/dist/react';
import { tinaField } from 'tinacms/dist/react';

/**
 * One poem.
 *
 * `whitespace-pre-wrap` is the whole design: the body is printed exactly as written,
 * line breaks, blank lines, indentation and mixed scripts intact. Nothing is added
 * around it — no commentary, no pull quotes, no explanation of what to feel. The
 * languages and the year sit small at the foot, where a reader looks only if they ask.
 */
/** A whole line wrapped in [] or (): a stage direction, not a sung line. */
const isDirection = (line: string) => /^\s*[\[(].*[\])]\s*$/.test(line);

/**
 * The lyrics exactly as they went into Suno, stage directions included.
 *
 * Nothing is removed — that text is the primary document, the thing that actually
 * existed and actually produced the song. The directions are set apart typographically
 * instead: smaller, dimmer, italic, the way a printed libretto sets speech in roman
 * and stage business in italics. An archive marks; it does not delete.
 */
const Lyrics = ({ text }: { text: string }) => (
  <div className='mt-6 font-[family-name:var(--font-serif)] text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-[var(--tz-parchment)]/75'>
    {text.split('\n').map((line, i) =>
      isDirection(line) ? (
        <p key={i} className='tz-mono my-1 pl-6 text-[0.8em] not-italic text-[var(--tz-gold-dim)]'>
          {line.trim()}
        </p>
      ) : (
        <p key={i} className='whitespace-pre-wrap'>
          {line || '\u00A0'}
        </p>
      )
    )}
  </div>
);

export default function PoemClientPage(props: { data: any; variables: any; query: string }) {
  const { data } = useTina({ query: props.query, variables: props.variables, data: props.data });
  const poem = data.poem;

  return (
    <article className='border-b tz-rule'>
      <div className='mx-auto max-w-3xl px-6 py-24 sm:py-32'>
        <Link href='/poetry' className='tz-mono transition-colors hover:text-[var(--tz-gold)]'>
          ← Poetry first
        </Link>

        <h1
          className='tz-display mt-10 text-[clamp(2rem,5vw,3.25rem)] text-[var(--tz-parchment)]'
          data-tina-field={tinaField(poem, 'title')}
        >
          {poem.title}
        </h1>

        {poem.subtitle && (
          <p className='tz-prose mt-2 text-[1.125rem] italic' data-tina-field={tinaField(poem, 'subtitle')}>
            {poem.subtitle}
          </p>
        )}

        {poem.image?.src && (
          // Above the poem, not behind it. Shown whole at its own aspect ratio —
          // nothing cropped, no type laid over it. A picture belonging to the poem is
          // part of the record, not a background for the record.
          <figure className='mt-12' data-tina-field={tinaField(poem.image, 'src')}>
            <Image
              src={poem.image.src}
              alt={poem.image.alt || ''}
              width={1448}
              height={1086}
              sizes='(min-width: 768px) 48rem, 100vw'
              className='h-auto w-full rounded-sm'
            />
          </figure>
        )}

        {poem.body && (
          <p className='tz-mono mt-14'>The poem</p>
        )}

        {poem.body && (
          <div
            className='mt-6 whitespace-pre-wrap font-[family-name:var(--font-serif)] text-[clamp(1.125rem,2.4vw,1.5rem)] leading-[1.75] text-[var(--tz-parchment)]'
            data-tina-field={tinaField(poem, 'body')}
          >
            {poem.body}
          </div>
        )}

        {poem.translation && (
          // Under the poem, not beside it — a phone has no facing page. Quieter than the
          // original on purpose: the poem is the work, the translation is a service to
          // the reader, and setting them identically would claim they are the same thing.
          <section className='mt-20 border-t tz-rule pt-10'>
            {poem.translationLabel && (
              <p className='tz-mono' data-tina-field={tinaField(poem, 'translationLabel')}>
                {poem.translationLabel}
              </p>
            )}
            <div
              className='mt-6 whitespace-pre-wrap font-[family-name:var(--font-serif)] text-[clamp(1rem,2vw,1.25rem)] leading-[1.75] text-[var(--tz-parchment)]/65'
              data-tina-field={tinaField(poem, 'translation')}
            >
              {poem.translation}
            </div>
          </section>
        )}

        {poem.lyrics && (
          <section className='mt-20 border-t tz-rule pt-10'>
            <p className='tz-mono'>The lyrics</p>
            <p className='tz-prose mt-2 max-w-xl text-[0.9375rem]'>
              As given to the machine, unedited.
            </p>
            <div data-tina-field={tinaField(poem, 'lyrics')}>
              <Lyrics text={poem.lyrics} />
            </div>
          </section>
        )}

        {poem.audio && (
          // The third stage, on the page rather than at the end of a link. Poem, then
          // lyrics, then the thing they became — the sequence the site argues for, all
          // in one place. preload='none': nobody pays for it before pressing play.
          <section className='mt-20 border-t tz-rule pt-10'>
            <p className='tz-mono'>The song</p>
            <audio
              controls
              preload='none'
              src={poem.audio}
              className='mt-6 h-10 w-full'
              data-tina-field={tinaField(poem, 'audio')}
            >
              <track kind='captions' />
            </audio>
          </section>
        )}

        {(poem.languages || poem.year || poem.listen) && (
          <footer className='mt-20 flex flex-wrap items-center gap-x-6 gap-y-2 border-t tz-rule pt-6'>
            {poem.languages && (
              <span className='tz-mono' data-tina-field={tinaField(poem, 'languages')}>
                {poem.languages}
              </span>
            )}
            {poem.year && (
              <span className='tz-mono' data-tina-field={tinaField(poem, 'year')}>
                {poem.year}
              </span>
            )}
            {poem.listen && (
              <a
                href={poem.listen}
                target='_blank'
                rel='noreferrer'
                className='tz-mono text-[var(--tz-gold)] transition-opacity hover:opacity-70'
                data-tina-field={tinaField(poem, 'listen')}
              >
                Listen →
              </a>
            )}
          </footer>
        )}
      </div>
    </article>
  );
}
