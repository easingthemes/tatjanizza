import type { Collection } from 'tinacms';

/**
 * The poems, as poems.
 *
 * The body is a plain textarea, deliberately not a rich-text field. Markdown collapses
 * a single newline into a space and eats leading spaces, which for prose is a courtesy
 * and for poetry is vandalism: the line breaks and the indentation *are* the writing.
 * Stored verbatim, rendered with `white-space: pre-wrap`, so what she types is exactly
 * what appears — mixed scripts, ellipses, blank lines between stanzas and all.
 */
const Poem: Collection = {
  label: 'Poems',
  name: 'poem',
  path: 'content/poems',
  format: 'mdx',
  ui: {
    router: ({ document }) => `/poetry/${document._sys.breadcrumbs.join('/')}`,
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      isTitle: true,
      required: true,
    },
    {
      type: 'string',
      name: 'subtitle',
      label: 'Second title',
      description: 'The title in the other language, if it has one. Shown under the title.',
    },
    {
      type: 'object',
      name: 'image',
      label: 'Image',
      description: 'Optional. Sits above the poem, full width. Nothing is cropped away at the sides.',
      fields: [
        { name: 'src', label: 'Image', type: 'image' },
        { name: 'alt', label: 'Alt text', type: 'string', description: 'What the picture shows, for a reader who cannot see it.' },
      ],
    },
    {
      type: 'string',
      name: 'body',
      label: 'The poem',
      description: 'Typed exactly as it should appear. Every line break and every blank line is kept.',
      ui: { component: 'textarea' },
    },
    {
      type: 'string',
      name: 'translation',
      label: 'Translation',
      description: 'Optional. Sits under the poem, quieter. Line breaks kept, same as the poem.',
      ui: { component: 'textarea' },
    },
    {
      type: 'string',
      name: 'translationLabel',
      label: 'Translation label',
      description: 'Small heading above the translation, e.g. In English.',
    },
    {
      type: 'string',
      name: 'lyrics',
      label: 'Lyrics',
      description: 'The text exactly as it went into Suno, stage directions and all. Not edited.',
      ui: { component: 'textarea' },
    },
    {
      type: 'string',
      name: 'ancientLayer',
      label: 'Historical language within',
      description: 'The old tongue the song carries — Akkadian, Hebrew, Phoenician, Old Greek. Shown beside the title in the list.',
    },
    {
      type: 'string',
      name: 'languages',
      label: 'Languages',
      description: 'Shown small at the foot of the poem, e.g. Serbian · Akkadian',
    },
    {
      type: 'string',
      name: 'year',
      label: 'Year written',
      description: 'The year of the poem, not of the recording.',
    },
    {
      type: 'string',
      name: 'audio',
      label: 'The song',
      description: 'Path to the audio in uploads, e.g. /uploads/song.mp3. Plays at the foot of the poem.',
    },
    {
      type: 'string',
      name: 'listen',
      label: 'Listen link',
      description: 'Where the song made from this poem can be heard. Leave empty if there is none yet.',
    },
    {
      type: 'number',
      name: 'order',
      label: 'Position in the list',
      description: 'Lower numbers come first on the Poetry First page.',
    },
  ],
};

export default Poem;
