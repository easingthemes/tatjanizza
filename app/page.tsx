import React from "react";
import ComingSoon from "@/components/coming-soon";

// TEMPORARY: coming-soon splash while the real site is built.
// It deliberately skips <Layout> so it can own the full viewport.
// To restore the Tina-driven home page, delete this and uncomment the block below.
export default function Home() {
  return <ComingSoon />;
}

// import client from "@/tina/__generated__/client";
// import Layout from "@/components/layout/layout";
// import ClientPage from "./[...urlSegments]/client-page";
//
// export const revalidate = 300;
//
// export default async function Home() {
//   const data = await client.queries.page({
//     relativePath: `home.mdx`,
//   });
//
//   return (
//     <Layout rawPageData={data}>
//       <ClientPage {...data} />
//     </Layout>
//   );
// }
