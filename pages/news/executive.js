import React from 'react';
import PropTypes from 'prop-types';
import { getBlogCategory, PAGE_SIZE } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import NewsHeader from '../../components/news-header';
import Meta from '../../components/meta';

const News = ({ posts }) => (
  <>
    <Meta subTitle="Executive" description="All the news about the QuidditchUK Executive" />
    <NewsHeader />
    <LatestNews posts={posts} category="Executive" allowPagination horizontalScroll={false} />
  </>
);

export const getStaticProps = async () => {
  const posts = await getBlogCategory('Executive', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE });

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
