import React from 'react';
import PropTypes from 'prop-types';
import { getBlogCategory, PAGE_SIZE } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import NewsHeader from '../../components/news-header';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';

const News = ({ posts }) => (
  <Layout>
    <Meta />
    <NewsHeader />
    <LatestNews posts={posts} category="Leagues" allowPagination horizontalScroll={false} />
  </Layout>
);

export const getStaticProps = async () => {
  const posts = await getBlogCategory('Leagues', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE });

  return {
    props: { posts },
    unstable_revalidate: 1,
  };
};

News.defaultProps = {
  posts: [],
};

News.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default News;
