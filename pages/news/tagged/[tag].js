import React from 'react';
import PropTypes from 'prop-types';
import { getBlogTags, PAGE_SIZE } from 'modules/prismic';

import LatestNews from 'components/latest-news';
import NewsHeader from 'components/news-header';
import Meta from 'components/meta';

const unDasherizeTag = (tag) => tag.replace(/--/g, ' ').replace(/__/g, '/');

const News = ({ posts, tag }) => (
  <>
    <Meta />
    <NewsHeader />
    <LatestNews posts={posts} tag={unDasherizeTag(tag)} allowPagination horizontalScroll={false} />
  </>
);

export const getServerSideProps = async ({ params: { tag } }) => {
  const posts = await getBlogTags([unDasherizeTag(tag)], { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE });

  return {
    props: { posts, tag },
  };
};

News.defaultProps = {
  posts: [],
  tag: '',
};

News.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
  tag: PropTypes.string,
};

export default News;
