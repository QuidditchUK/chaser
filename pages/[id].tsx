import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import withShell from '../components/shell';
import { getPrismicDocByUid, getDocs } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';
import Layout from '../containers/layout';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';

import { formatMetadata } from '../modules/prismic';

const Page = ({ page: { data } }) => (
  <Layout>
    <Meta {...formatMetadata(data)} />
    <>{renderPrismicSections(data.body)}</>
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  const uid = id.toString();
  const page = await getPrismicDocByUid('pages', uid);

  return {
    props: { page }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getDocs('pages');

  return {
    paths: allPages?.map(({ uid }) => `/${uid}`),
    fallback: true,
  };
}

export default withShell(Page);