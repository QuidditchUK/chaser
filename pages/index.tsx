import React from 'react';
import { GetStaticProps } from 'next';

import withShell from '../components/shell';
import { getPrismicDocByUid, formatMetadata } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';


const Home = ({ page: { data } }) => (
  <Layout>
    <Meta {...formatMetadata(data)} />
    <>{renderPrismicSections(data.body)}</>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  return {
    props: { page },
  };
};

export default withShell(Home);
