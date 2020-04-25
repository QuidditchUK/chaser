import React from 'react';
import PropTypes from 'prop-types';
import { getBlogCategory } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import NewsHeader from '../../components/news-header';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';

const News = ({ posts }) => (
  <Layout>
    <Meta />
    <NewsHeader />
    <LatestNews posts={posts} category="University" />
  </Layout>
);

export const getStaticProps = async () => {
  const posts = await getBlogCategory('University', { orderings: '[my.post.date desc]', pageSize: 18 });

  return {
    props: { posts },
  };
};

News.defaultProps = {
  posts: [],
};

News.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default News;
