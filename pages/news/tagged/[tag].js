import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { getBlogTags, PAGE_SIZE } from 'modules/prismic';

const LatestNews = dynamic(() => import('components/latest-news'));
const NewsHeader = dynamic(() => import('components/news-header'));
const Meta = dynamic(() => import('components/meta'));

const unDasherizeTag = (tag) => tag.replace(/--/g, ' ').replace(/__/g, '/');

const News = ({ posts, tag }) => (
  <>
    <Meta subTitle={unDasherizeTag(tag)} description={`All news tagged ${unDasherizeTag(tag)}`} />
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
