'use client';
import Image from 'next/image';
import * as React from 'react';

/**
 * Temporary landing splash shown while the real site is being built.
 * Rendered directly by app/page.tsx, bypassing components/layout/layout.tsx
 * so it can own the full viewport with no header or footer.
 */

type Phrase = {
  /** BCP-47 tag, used for lang/dir so browsers pick sane fonts and direction */
  lang: string;
  text: string;
};

/**
 * Languages mirror the ones Tatjanizza actually records in.
 * Add a language by appending here — nothing else needs changing.
 *
 * The ancient-language entries marked UNVERIFIED are best-effort and must be
 * confirmed by Tatjana before this is public. Dead languages written in scripts
 * browsers rarely have fonts for (Phoenician, cuneiform) use Latin
 * transliteration so they render instead of showing tofu boxes.
 */
const PHRASES: Phrase[] = [
  { lang: 'en', text: 'COMING SOON' },
  { lang: 'sr-Cyrl', text: 'УСКОРО' },
  { lang: 'he', text: 'בקרוב' },
  { lang: 'cy', text: 'YN FUAN' },
  { lang: 'sa', text: 'शीघ्रम्' },
  { lang: 'non', text: 'BRÁTT' },
  { lang: 'grc', text: 'ΤΑΧΕΩΣ' },
  { lang: 'akk-Latn', text: 'URRUHIŠ' }, // UNVERIFIED
  { lang: 'phn-Latn', text: 'BQRB' }, // UNVERIFIED
];

const GLYPHS = 'アカサタナハマヤラワイキシチニヒミリヰウクスツヌフムユルエケセテネヘメレヱオコソトノホモヨロヲ0123456789';
const HOLD_MS = 2600;
const SCRAMBLE_MS = 700;

/** Matrix rain on a canvas, sized to the viewport. Skipped when the user prefers reduced motion. */
const MatrixRain = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FONT_SIZE = 16;
    let columns: number[] = [];
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // One falling stream per column, each starting at a random height
      columns = new Array(Math.ceil(window.innerWidth / FONT_SIZE))
        .fill(0)
        .map(() => Math.random() * (window.innerHeight / FONT_SIZE));
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      // Throttle to ~20fps; the effect looks better slow and costs less battery
      if (frame++ % 3 !== 0) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${FONT_SIZE}px ui-monospace, monospace`;

      columns.forEach((y, i) => {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        ctx.fillStyle = 'rgba(0, 255, 65, 0.55)';
        ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);
        columns[i] = y * FONT_SIZE > window.innerHeight && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden='true' className='pointer-events-none absolute inset-0 opacity-40' />;
};

/** Cycles the phrases, scrambling each one into place. */
const ScrambledPhrase = () => {
  const [index, setIndex] = React.useState(0);
  const [display, setDisplay] = React.useState(PHRASES[0].text);
  const phrase = PHRASES[index];

  React.useEffect(() => {
    const target = phrase.text;
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
    const next = setTimeout(() => setIndex((i) => (i + 1) % PHRASES.length), HOLD_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(next);
    };
  }, [phrase]);

  return (
    <p
      lang={phrase.lang}
      dir='auto'
      aria-label='Coming soon'
      className='text-center font-mono text-2xl tracking-[0.35em] text-[#00ff41] sm:text-4xl'
      style={{ textShadow: '0 0 8px rgba(0,255,65,0.8), 0 0 24px rgba(0,255,65,0.4)' }}
    >
      {display}
    </p>
  );
};

export const ComingSoon = () => {
  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-black px-6'>
      <MatrixRain />
      <div className='relative shrink-0'>
        <Image
          src='/uploads/posts/main.jpg'
          alt='Tatjanizza'
          width={1024}
          height={1024}
          priority
          sizes='(max-width: 640px) 70vw, 380px'
          className='h-auto w-[70vw] max-w-[380px] rounded-full border border-[#00ff41]/30 shadow-[0_0_60px_rgba(0,255,65,0.25)]'
        />
      </div>
      <div className='relative flex h-16 items-center'>
        <ScrambledPhrase />
      </div>
    </main>
  );
};

export default ComingSoon;
