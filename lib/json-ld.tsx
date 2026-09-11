import React from 'react';
import { SITE_NAME, SITE_URL } from './seo';

const SPOTIFY_ARTIST = 'https://open.spotify.com/artist/09tBWDb9mvGH9ls4c2ovDr';

/** Language names as they are written in the CMS, mapped to BCP-47 tags. */
const LANGUAGE_TAGS: Record<string, string> = {
  serbian: 'sr',
  english: 'en',
  sumerian: 'sux',
  akkadian: 'akk',
  phoenician: 'phn',
  hebrew: 'he',
  sanskrit: 'sa',
  'ancient greek': 'grc',
  'old greek': 'grc',
  'old norse': 'non',
  welsh: 'cy',
};

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/**
 * Turns the human dates the CMS holds ("18 May 2026") into ISO 8601.
 *
 * Returns undefined rather than guessing when the string is not a full date — a
 * wrong date on a page whose whole argument is "here is the dated record" is worse
 * than no date at all.
 */
export function toIsoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^(\d{1,2})\s+([A-Za-zÀ-ž]+)\s+(\d{4})$/);
  if (!match) return undefined;
  const month = MONTHS.indexOf(match[2].toLowerCase());
  if (month < 0) return undefined;
  return `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

function languageTag(name?: string | null): string | undefined {
  if (!name) return undefined;
  return LANGUAGE_TAGS[name.trim().toLowerCase()];
}

export const personJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#tatjanizza`,
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: 'Writer and conceptual artist',
  description: 'Berlin-based writer and conceptual artist working with language, generative AI and music.',
  sameAs: [SPOTIFY_ARTIST],
});

type TrackInput = {
  title?: string | null;
  sungIn?: string | null;
  ancientLayer?: string | null;
  released?: string | null;
  link?: string | null;
} | null;

/**
 * The machine-readable half of the record.
 *
 * `inLanguage` is the language the song is actually sung in. The historical language
 * inside the track is a separate `about` entry, because it is a subject of the work,
 * not the language of the recording — conflating them would misstate the catalogue.
 */
export const albumJsonLd = ({
  name,
  description,
  url,
  datePublished,
  tracks,
}: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  tracks: TrackInput[];
}) => {
  const artist = { '@type': 'Person', '@id': `${SITE_URL}/#tatjanizza`, name: SITE_NAME, url: SITE_URL };
  const realTracks = tracks.filter((track): track is NonNullable<TrackInput> => Boolean(track?.title));

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': `${url}#album`,
    name,
    description,
    url,
    byArtist: artist,
    ...(datePublished ? { datePublished } : {}),
    numTracks: realTracks.length,
    track: realTracks.map((track, index) => ({
      '@type': 'MusicRecording',
      position: index + 1,
      name: track.title,
      byArtist: artist,
      ...(languageTag(track.sungIn) ? { inLanguage: languageTag(track.sungIn) } : {}),
      ...(track.ancientLayer ? { about: { '@type': 'Language', name: track.ancientLayer } } : {}),
      ...(toIsoDate(track.released) ? { datePublished: toIsoDate(track.released) } : {}),
      ...(track.link ? { url: track.link } : {}),
    })),
  };
};

/**
 * Renders a JSON-LD block. Server-only — it never needs to hydrate.
 *
 * `<` is escaped so a stray `</script>` in editable content cannot close the tag early.
 */
export const JsonLd = ({ data }: { data: object }) => (
  <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
);
