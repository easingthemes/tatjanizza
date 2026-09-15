import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { Section } from '@/components/layout/section';
import { JsonLd, albumJsonLd, toIsoDate } from '@/lib/json-ld';
import { SITE_DESCRIPTION, SITE_URL, pageMetadata } from '@/lib/seo';
import ClientPage from './client-page';

export const revalidate = 300;

const pathOf = (segments: string[]) => segments.join('/');

async function getPage(segments: string[]) {
  try {
    return await client.queries.page({ relativePath: `${pathOf(segments)}.mdx` });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}): Promise<Metadata> {
  const { urlSegments } = await params;
  const result = await getPage(urlSegments);
  if (!result) return {};

  const page = result.data.page as any;
  return pageMetadata({ seo: page.seo, title: page.title, path: `/${pathOf(urlSegments)}` });
}

/**
 * Builds the album record from what the page already says, so the structured data
 * cannot drift away from the visible text: the track list comes from the Selected
 * works block and the release date from the Provenance block.
 */
function albumFor(page: any, path: string) {
  const blocks: any[] = page.blocks ?? [];
  const tracks = blocks.find((block) => block?.__typename === 'PageBlocksTzTracks');
  if (!tracks?.tracks?.length || !page.title) return null;

  const credits = blocks.find((block) => block?.__typename === 'PageBlocksTzCredits');
  const released = credits?.entries?.find((entry: any) => /first released/i.test(entry?.term ?? ''))?.value;

  return albumJsonLd({
    name: page.title,
    description: page.seo?.description || SITE_DESCRIPTION,
    url: `${SITE_URL}${path}`,
    datePublished: toIsoDate(released),
    tracks: tracks.tracks,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlSegments: string[] }>;
}) {
  const { urlSegments } = await params;
  const data = await getPage(urlSegments);
  if (!data) notFound();

  const album = albumFor(data.data.page as any, `/${pathOf(urlSegments)}`);

  return (
    <Layout rawPageData={data}>
      {album && <JsonLd data={album} />}
      <Section>
        <ClientPage {...data} />
      </Section>
    </Layout>
  );
}

export async function generateStaticParams() {
  let pages = await client.queries.pageConnection();
  const allPages = pages;

  if (!allPages.data.pageConnection.edges) {
    return [];
  }

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    });

    if (!pages.data.pageConnection.edges) {
      break;
    }

    allPages.data.pageConnection.edges.push(...pages.data.pageConnection.edges);
  }

  const params = allPages.data?.pageConnection.edges
    .map((edge) => ({
      urlSegments: edge?.node?._sys.breadcrumbs || [],
    }))
    .filter((x) => x.urlSegments.length >= 1)
    .filter((x) => !x.urlSegments.every((x) => x === 'home')); // exclude the home page

  return params;
}
