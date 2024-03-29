import { useState, useEffect } from 'react';
import * as prismic from '@prismicio/client';
import dynamic from 'next/dynamic';
import { useInfiniteQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import {
  getBlogCategory,
  PAGE_SIZE,
  client,
  getBasePageProps,
} from 'modules/prismic';

const LoadMore = dynamic(() =>
  import('pages/news').then(({ LoadMore }) => LoadMore)
);
const LatestNews = dynamic(() => import('components/prismic/latest-news'));
const NewsHeader = dynamic(() => import('components/news/news-header'));
const Meta = dynamic(() => import('components/shared/meta'));

const getPagedDocs = ({ pageParam = 1 }) =>
  client().get({
    predicates: prismic.predicate.at('my.post.category', 'Leagues'),
    orderings: {
      field: 'my.post.date',
      direction: 'desc',
    },
    pageSize: PAGE_SIZE,
    page: pageParam,
  });

const News = ({ posts: initialPosts = [] }) => {
  const [showLoadMore, setShowLoadMore] = useState(true);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(
    ['news', 'leagues'],
    getPagedDocs,
    {
      getNextPageParam: (lastPage) => lastPage.page + 1,
    }
  );

  const posts =
    data?.pages?.reduce((acc, { results }) => acc.concat(results), []).flat() ||
    initialPosts;

  useEffect(() => {
    if (posts?.length % PAGE_SIZE !== 0) {
      setShowLoadMore(false);
    }
  }, [posts]);

  return (
    <>
      <Meta
        subTitle="Leagues"
        description="All the latest results and news across QuadballUK's leagues"
      />
      <NewsHeader />
      <LatestNews
        category="Leagues"
        posts={posts}
        horizontalScroll={false}
        showAllNewsButton={false}
      />
      {isFetching && (
        <Flex
          alignItems="center"
          justifyContent="center"
          py={5}
          color="qukBlue"
        >
          Loading...
        </Flex>
      )}

      {showLoadMore && !isFetching && (
        <LoadMore fetchNextPage={fetchNextPage} />
      )}
    </>
  );
};

export const getStaticProps = async () => {
  const basePageProps = await getBasePageProps();
  const posts = await getBlogCategory('Leagues', {
    orderings: {
      field: 'my.post.date',
      direction: 'desc',
    },
    pageSize: PAGE_SIZE,
  });

  return {
    props: { posts, ...basePageProps },
    revalidate: 1,
  };
};

export default News;
