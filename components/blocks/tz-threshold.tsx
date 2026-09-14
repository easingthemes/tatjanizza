'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { PageBlocksTzThreshold } from '../../tina/__generated__/types';

/**
 * The threshold.
 *
 * One word falling through the languages the project moves through, over a rain of
 * glyphs. Descended from the Matrix splash this site launched with, with the two
 * things that made it a wall removed: it is a section rather than a page, and there
 * is nothing to click. A visitor lands in it and scrolls out of it.
 *
 * Green became gold because the rest of the site is gold on void, and the rain is
 * mixed scripts rather than katakana alone — the same argument the songs make, that
 * writing systems are how time is marked.
 */

const GLYPHS =
  'アカサタナハマヤラワイキシチニヒミリヰウクスツヌフムユルエケセテネヘメレヱオコソトノホモヨロヲ' +
  'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ' +
  'אבגדהוזחטיכלמנסעפצקרשת' +
  '0123456789';

const HOLD_MS = 2600;
const SCRAMBLE_MS = 700;

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Rain on a canvas sized to its own section, not the window.
 *
 * Paused while scrolled out of view: this sits at the top of the home page, and a
 * canvas animating under three screens of text below it is pure battery cost.
 */
const Rain = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!ctx || !parent) return;

    const FONT_SIZE = 16;
    let columns: number[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // One falling stream per column, each starting at a random height
      columns = new Array(Math.ceil(width / FONT_SIZE))
        .fill(0)
        .map(() => Math.random() * (height / FONT_SIZE));
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible || !width) return;
      // Throttle to ~20fps; the effect reads better slow and costs less battery
      if (frame++ % 3 !== 0) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT_SIZE}px ui-monospace, monospace`;
      ctx.fillStyle = 'rgba(212, 175, 90, 0.5)';

      columns.forEach((y, i) => {
        ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * FONT_SIZE, y * FONT_SIZE);
        columns[i] = y * FONT_SIZE > height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(parent);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden='true' className='pointer-events-none absolute inset-0' />;
};

type Phrase = { lang?: string | null; text?: string | null };

/** Cycles the phrases, scrambling each one into place. */
const Scrambled = ({ phrases, label }: { phrases: Phrase[]; label: string }) => {
  const [index, setIndex] = React.useState(0);
  const phrase = phrases[index % phrases.length];
  const target = phrase?.text ?? '';
  const [display, setDisplay] = React.useState(target);

  React.useEffect(() => {
    if (!target) return;

    if (prefersReducedMotion()) {
      setDisplay(target);
      const next = setTimeout(() => setIndex((i) => i + 1), HOLD_MS);
      return () => clearTimeout(next);
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
      // Reveal left-to-right; unrevealed characters keep flickering
      const settled = Math.floor(progress * target.length);
      setDisplay(
        target
          .split('')
          .map((char, i) => (i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      );
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };

    raf = requestAnimationFrame(tick);
    const next = setTimeout(() => setIndex((i) => i + 1), HOLD_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(next);
    };
  }, [target]);

  return (
    <p
      lang={phrase?.lang || undefined}
      dir='auto'
      // Screen readers get the word once, in the site's language, rather than a
      // stream of half-scrambled strings as the animation runs.
      aria-label={label}
      className='text-center font-[family-name:var(--font-mono)] text-[clamp(1.5rem,6vw,3rem)] tracking-[0.3em] text-[var(--tz-gold)]'
      style={{ textShadow: '0 0 10px rgba(212,175,90,0.55), 0 0 30px rgba(212,175,90,0.25)' }}
    >
      <span aria-hidden='true'>{display}</span>
    </p>
  );
};

export const TzThreshold = ({ data }: { data: PageBlocksTzThreshold }) => {
  const phrases = (data.phrases ?? []).filter((p): p is NonNullable<typeof p> => Boolean(p?.text));
  if (!phrases.length) return null;

  return (
    // -mt-20 pulls the section under the fixed header; mb-20 gives the next block back
    // what its own -mt-20 takes, so the two sit flush instead of overlapping.
    <section className='relative -mt-20 mb-20 flex min-h-[92svh] flex-col items-center justify-center overflow-hidden bg-[var(--tz-void)] px-6'>
      <Rain />

      <div className='relative flex min-h-24 items-center' data-tina-field={tinaField(data, 'phrases')}>
        <Scrambled phrases={phrases} label={data.label || phrases[0].text || ''} />
      </div>

      {data.hint && (
        <p
          className='tz-mono absolute bottom-10 animate-pulse text-[var(--tz-gold-dim)]'
          data-tina-field={tinaField(data, 'hint')}
        >
          {data.hint}
        </p>
      )}
    </section>
  );
};

export const tzThresholdBlockSchema: Template = {
  name: 'tzThreshold',
  label: 'TZ — Threshold',
  ui: {
    defaultItem: {
      label: 'Presence',
      hint: '↓',
      phrases: [{ lang: 'en', text: 'PRESENCE' }],
    },
    itemProps: () => ({ label: 'Threshold' }),
  },
  fields: [
    {
      type: 'string',
      label: 'The word, in plain English',
      name: 'label',
      description: 'Read aloud by screen readers instead of the animation. Not shown on the page.',
    },
    {
      type: 'string',
      label: 'Scroll hint',
      name: 'hint',
      description: 'Small mark at the bottom. Leave empty to hide it.',
    },
    {
      type: 'object',
      label: 'The word, language by language',
      name: 'phrases',
      list: true,
      ui: {
        itemProps: (item) => ({ label: [item?.lang, item?.text].filter(Boolean).join('  ·  ') }),
      },
      fields: [
        {
          type: 'string',
          label: 'Language code',
          name: 'lang',
          description: 'e.g. en, sr-Cyrl, he, cy, sa, grc, non. Lets browsers pick the right font and text direction.',
        },
        { type: 'string', label: 'The word', name: 'text' },
      ],
    },
  ],
};
