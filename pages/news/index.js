import Prismic from 'prismic-javascript';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Flex, Button } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import { getDocs, PAGE_SIZE, Client } from 'modules/prismic';
import { useInfiniteQuery } from 'react-query';

const LatestNews = dynamic(() => import('components/latest-news'));
const NewsHeader = dynamic(() => import('components/news-header'));
const Meta = dynamic(() => import('components/meta'));

const getPagedDocs = ({ pageParam = 0 }) =>
  Client().query(Prismic.Predicates.at('document.type', 'post'), {
    orderings: '[my.post.date desc]',
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
      <LatestNews posts={posts} horizontalScroll={false} />
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
  const posts = await getDocs('post', {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
    page: 1,
  });

  return {
    props: { posts },
    revalidate: 1,
  };
};

export default News;
