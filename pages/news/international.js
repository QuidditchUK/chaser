import React from 'react';
import PropTypes from 'prop-types';
import { getBlogCategory, PAGE_SIZE } from 'modules/prismic';

import LatestNews from 'components/latest-news';
import NewsHeader from 'components/news-header';
import Meta from 'components/meta';

const News = ({ posts }) => (
  <>
    <Meta subTitle="International" description="All news about the national teams and international competitions" />
    <NewsHeader />
    <LatestNews posts={posts} category="International" allowPagination horizontalScroll={false} />
  </>
);

export const getStaticProps = async () => {
  const posts = await getBlogCategory('International', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE });

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
