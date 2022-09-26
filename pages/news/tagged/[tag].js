import { useState, useEffect } from 'react';
import * as prismic from '@prismicio/client';
import dynamic from 'next/dynamic';
import { useInfiniteQuery } from 'react-query';
import { Flex } from '@chakra-ui/react';
import {
  getBlogTags,
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

const unDasherizeTag = (tag) => tag.replace(/--/g, ' ').replace(/__/g, '/');

const getPagedDocs = ({ pageParam = 1, tag }) => {
  return client().get({
    predicates: [
      prismic.predicate.at('document.type', 'post'),
      prismic.predicate.any('document.tags', [unDasherizeTag(tag)]),
    ],
    orderings: {
      field: 'my.post.date',
      direction: 'desc',
    },
    pageSize: PAGE_SIZE,
    page: pageParam,
  });
};

const News = ({ posts: initialPosts = [], tag = '' }) => {
  const [showLoadMore, setShowLoadMore] = useState(true);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery(
    ['news', 'tagged', tag],
    ({ pageParam }) => getPagedDocs({ pageParam, tag }),
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
        subTitle={unDasherizeTag(tag)}
        description={`All news tagged ${unDasherizeTag(tag)}`}
      />
      <NewsHeader />
      <LatestNews
        tag={unDasherizeTag(tag)}
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

export const getServerSideProps = async ({ params: { tag } }) => {
  const basePageProps = await getBasePageProps();
  const posts = await getBlogTags([unDasherizeTag(tag)], {
    orderings: {
      field: 'my.post.date',
      direction: 'desc',
    },
    pageSize: PAGE_SIZE,
  });

  return {
    props: { posts, tag, ...basePageProps },
  };
};

export default News;
