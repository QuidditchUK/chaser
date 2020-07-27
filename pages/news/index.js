import React from 'react';
import PropTypes from 'prop-types';
import { getDocs, PAGE_SIZE } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import NewsHeader from '../../components/news-header';
import Meta from '../../components/meta';

const News = ({ posts }) => (
  <>
    <Meta />
    <NewsHeader />
    <LatestNews posts={posts} allowPagination horizontalScroll={false} />
  </>
);

export const getStaticProps = async () => {
  const posts = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE });

  return {
    props: { posts },
    revalidate: 1,
  };
};

News.defaultProps = {
  posts: [],
};

News.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default News;
