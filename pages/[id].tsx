import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import { getPrismicDocByUid, getDocs, formatMetadata } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';
import { PageProps } from '../types';

const Page = ({ page }: PageProps) => (
  <>
    {page
      ? (
        <Layout>
          <Meta {...formatMetadata(page.data)} />
          <>{renderPrismicSections(page.data.body)}</>
        </Layout>
      )
      : (<></>)}
  </>
);

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  const uid = id.toString();
  const page = await getPrismicDocByUid('pages', uid);

  return {
    props: { page },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getDocs('pages');

  return {
    paths: allPages?.map(({ uid }) => `/${uid}`),
    fallback: true,
  };
};

export default Page;
