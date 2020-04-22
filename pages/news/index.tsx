import React from 'react';
import { GetStaticProps } from 'next';
import { getDocs } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';
import { Page } from '../../types';

const News = ({ posts }: Page) => (
  <Layout>
    <Meta />
    <LatestNews posts={posts} />
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: 18 });

  return {
    props: { posts },
  };
};

export default News;
