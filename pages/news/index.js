import React from 'react';
import PropTypes from 'prop-types';
import { getDocs } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';

const News = ({ posts }) => (
  <Layout>
    <Meta />
    <LatestNews posts={posts} />
  </Layout>
);

export const getStaticProps = async () => {
  const posts = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: 18 });

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
