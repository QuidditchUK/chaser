import { useState, useEffect } from 'react';
import Prismic from 'prismic-javascript';
import dynamic from 'next/dynamic';
import { useInfiniteQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import { getBlogCategory, PAGE_SIZE, Client } from 'modules/prismic';
import { LoadMore } from 'pages/news';

const LatestNews = dynamic(() => import('components/latest-news'));
const NewsHeader = dynamic(() => import('components/news-header'));
const Meta = dynamic(() => import('components/meta'));

const getPagedDocs = ({ pageParam = 0 }) =>
  Client().query(Prismic.Predicates.at('my.post.category', 'International'), {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
    page: pageParam,
  });

const News = ({ posts: initialPosts = [] }) => {
  const [showLoadMore, setShowLoadMore] = useState(true);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(
    ['news', 'international'],
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
        subTitle="International"
        description="All news about the national teams and international competitions"
      />
      <NewsHeader />
      <LatestNews
        category="International"
        posts={posts}
        horizontalScroll={false}
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
  const posts = await getBlogCategory('International', {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
  });

  return {
    props: { posts },
    revalidate: 1,
  };
};

export default News;
