import * as React from 'react';
import { GetStaticProps } from 'next';

import { getPrismicDocByUid, formatMetadata, getDocs } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';
import { Page } from '../types';

const Home = ({ page, posts }: Page) => (
  <Layout>
    <Meta {...formatMetadata(page.data)} />
    <>{renderPrismicSections(page.data.body, posts)}</>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  const posts = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: 18 });

  return {
    props: { page, posts },
  };
};

export default Home;
