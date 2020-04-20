import * as React from 'react';
import { GetStaticProps } from 'next';

import { getPrismicDocByUid, formatMetadata } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';
import { Page } from '../types';

const Home = ({ page }: Page) => (
  <Layout>
    <Meta {...formatMetadata(page.data)} />
    <>{renderPrismicSections(page.data.body)}</>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  return {
    props: { page },
  };
};

export default Home;
