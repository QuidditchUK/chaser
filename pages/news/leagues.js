import React from 'react';
import PropTypes from 'prop-types';
import { getBlogCategory, PAGE_SIZE } from '../../modules/prismic';

import LatestNews from '../../components/latest-news';
import NewsHeader from '../../components/news-header';
import Meta from '../../components/meta';

const News = ({ posts }) => (
  <>
    <Meta subTitle="Leagues" description="All the latest results and news across QuidditchUK's leagues" />
    <NewsHeader />
    <LatestNews posts={posts} category="Leagues" allowPagination horizontalScroll={false} />
  </>
);

export const getStaticProps = async () => {
  const posts = await getBlogCategory('Leagues', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE });

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
