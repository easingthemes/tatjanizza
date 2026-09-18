import React from 'react';
import type { Metadata } from 'next';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { pageMetadata } from '@/lib/seo';
import PoetryClientPage from './client-page';

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  seo: {
    title: 'Poetry First — the poems behind Two Million Years',
    description:
      'Poetry first. Then we taught the machine to sing. The poems Tatjanizza wrote in 2025, before any of them became music.',
  },
  path: '/poetry',
});

export default async function PoetryPage() {
  const data = await client.queries.poemConnection();

  return (
    <Layout rawPageData={data}>
      <PoetryClientPage {...data} />
    </Layout>
  );
}
