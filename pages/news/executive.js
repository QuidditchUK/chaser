import { useState, useEffect } from 'react';
import Prismic from '@prismicio/client';
import dynamic from 'next/dynamic';
import { useInfiniteQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import {
  getBlogCategory,
  PAGE_SIZE,
  Client,
  getBasePageProps,
} from 'modules/prismic';

const LoadMore = dynamic(() =>
  import('pages/news').then(({ LoadMore }) => LoadMore)
);
const LatestNews = dynamic(() => import('components/prismic/latest-news'));
const NewsHeader = dynamic(() => import('components/news/news-header'));
const Meta = dynamic(() => import('components/shared/meta'));

const getPagedDocs = ({ pageParam = 0 }) =>
  Client().query(Prismic.Predicates.at('my.post.category', 'Executive'), {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
    page: pageParam,
  });

const News = ({ posts: initialPosts = [] }) => {
  const [showLoadMore, setShowLoadMore] = useState(true);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(
    ['news', 'executive'],
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
        subTitle="Executive"
        description="All the news about the QuidditchUK Executive"
      />
      <NewsHeader />
      <LatestNews
        category="Executive"
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
  const posts = await getBlogCategory('Executive', {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
  });

  return {
    props: { posts, ...basePageProps },
    revalidate: 1,
  };
};

export default News;
