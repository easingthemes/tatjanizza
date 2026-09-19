import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { pageMetadata } from '@/lib/seo';
import PoemClientPage from './client-page';

export const revalidate = 300;

const pathOf = (segments: string[]) => segments.join('/');

async function getPoem(segments: string[]) {
  try {
    return await client.queries.poem({ relativePath: `${pathOf(segments)}.mdx` });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ urlSegments: string[] }> }): Promise<Metadata> {
  const { urlSegments } = await params;
  const result = await getPoem(urlSegments);
  if (!result) return {};

  const poem = result.data.poem as any;
  // The opening lines stand in for a description: a poem should not be summarised,
  // and the first thing a search result shows ought to be the poem's own voice.
  const opening = (poem.body ?? '').split('\n').filter(Boolean).slice(0, 3).join(' / ').slice(0, 180);

  return pageMetadata({
    seo: { title: `${poem.title} — a poem by Tatjanizza`, description: opening || undefined, image: poem.image?.src },
    title: poem.title,
    path: `/poetry/${pathOf(urlSegments)}`,
  });
}

export default async function PoemPage({ params }: { params: Promise<{ urlSegments: string[] }> }) {
  const { urlSegments } = await params;
  const data = await getPoem(urlSegments);
  if (!data) notFound();

  return (
    <Layout rawPageData={data}>
      <PoemClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  let poems = await client.queries.poemConnection();
  const edges = [...(poems.data.poemConnection.edges ?? [])];

  while (poems.data.poemConnection.pageInfo.hasNextPage) {
    poems = await client.queries.poemConnection({ after: poems.data.poemConnection.pageInfo.endCursor });
    if (!poems.data.poemConnection.edges) break;
    edges.push(...poems.data.poemConnection.edges);
  }

  return edges
    .map((edge) => ({ urlSegments: edge?.node?._sys.breadcrumbs || [] }))
    .filter((x) => x.urlSegments.length >= 1);
}
