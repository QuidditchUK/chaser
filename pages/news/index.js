import * as prismic from '@prismicio/client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Flex, Button } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import {
  getDocs,
  PAGE_SIZE,
  client,
  getBasePageProps,
} from '../../modules/prismic';

const LatestNews = dynamic(() => import('components/prismic/latest-news'));
const NewsHeader = dynamic(() => import('components/news/news-header'));
const Meta = dynamic(() => import('components/shared/meta'));

const getPagedDocs = ({ pageParam = 1 }) =>
  client().get({
    predicates: prismic.predicate.at('document.type', 'post'),
    orderings: {
      field: 'my.post.date',
      direction: 'desc',
    },
    pageSize: PAGE_SIZE,
    page: pageParam,
  });

export const LoadMore = ({ fetchNextPage }) => {
  const [ref, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Flex alignItems="center" justifyContent="center" py={5} ref={ref}>
      <Button variant="light">Load More</Button>
    </Flex>
  );
};

const News = ({ posts: initialPosts = [] }) => {
  const [showLoadMore, setShowLoadMore] = useState(true);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(
    'news',
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
      <Meta subTitle="News" />
      <NewsHeader />
      <LatestNews
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
  const posts = await getDocs('post', {
    orderings: {
      field: 'my.post.date',
      direction: 'desc',
    },
    pageSize: PAGE_SIZE,
    page: 1,
  });

  return {
    props: { posts, ...basePageProps },
    revalidate: 1,
  };
};

export default News;
