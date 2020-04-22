import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import { getPrismicDocByUid, getDocs, formatMetadata } from '../../modules/prismic';
import renderPrismicSections from '../../constants/prismic';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';
import { Page as PageProps } from '../../types';

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
  const page = await getPrismicDocByUid('info', uid);

  return {
    props: { page },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getDocs('info');

  return {
    paths: allPages?.map(({ uid }) => `/info/${uid}`),
    fallback: true,
  };
};

export default Page;
