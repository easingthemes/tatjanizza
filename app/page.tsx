import React from 'react';
import type { Metadata } from 'next';
import client from '@/tina/__generated__/client';
import Layout from '@/components/layout/layout';
import { JsonLd, personJsonLd } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';
import ClientPage from './[...urlSegments]/client-page';

export const revalidate = 300;

const home = () => client.queries.page({ relativePath: 'home.mdx' });

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await home();
  return pageMetadata({ seo: (data.page as any).seo, title: data.page.title, path: '/' });
}

export default async function Home() {
  const data = await home();

  return (
    <Layout rawPageData={data}>
      <JsonLd data={personJsonLd()} />
      <ClientPage {...data} />
    </Layout>
  );
}
