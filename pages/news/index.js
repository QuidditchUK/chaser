import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { getDocs, PAGE_SIZE } from 'modules/prismic';

const LatestNews = dynamic(() => import('components/latest-news'));
const NewsHeader = dynamic(() => import('components/news-header'));
const Meta = dynamic(() => import('components/meta'));

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
