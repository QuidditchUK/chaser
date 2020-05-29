import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

import { Grid, Flex, Box } from 'components/layout';
import Card from 'components/card';
import Image from 'components/image';
import Button from 'components/button';
import Container from 'components/container';
import Heading from 'components/heading';
import {
  getDocs,
  getBlogCategory,
  getBlogTags,
  PAGE_SIZE,
} from 'modules/prismic';

export const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const HorizontalScrollWrapper = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    overflow-x: initial;
    overflow-y: initial;
  }
`;

export const HorizontalSpacer = styled.div`
  display: block;

   @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    display: none;
  }
`;

const LoadMore = ({ setPage }) => {
  const [ref, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [inView, setPage]);


  return (
    <Flex alignItems="center" justifyContent="center" py={5} ref={ref}><Button variant="light">Load More</Button></Flex>
  );
};

LoadMore.propTypes = {
  setPage: PropTypes.func.isRequired,
};

export const HorizontalNews = ({ horizontalScroll, posts }) => (
  <>
    {horizontalScroll
      ? (
        <HorizontalScrollWrapper>
          <Grid
            gridTemplateColumns={{ _: `1rem repeat(${posts.length}, calc(75% - 40px)) 2.5rem`, m: 'repeat(auto-fit, minmax(300px, 1fr))' }}
            gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          >
            <HorizontalSpacer />

            {posts.map(({ uid, data }) => (
              <Flex flexDirection="column" key={uid}>
                <Link href="/news/[id]" as={`/news/${uid}`} passHref>
                  <StyledLink>
                    <Card
                      variant="light"
                      name={data.title}
                      category={data.category}
                      image={(
                        <Image
                          src={data.image.url}
                          alt={data.image.alt}
                          width={1600}
                          height={900}
                        />
                      )}
                    />
                  </StyledLink>
                </Link>
              </Flex>
            ))}

            <HorizontalSpacer />
          </Grid>
        </HorizontalScrollWrapper>
      )
      : (
        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          px={{ _: 'gutter._', s: 'gutter.s', m: 0 }}
        >
          {posts.map(({ uid, data }) => (
            <Flex flexDirection="column" key={uid}>
              <Link href="/news/[id]" as={`/news/${uid}`} passHref>
                <StyledLink>
                  <Card
                    variant="light"
                    name={data.title}
                    category={data.category}
                    image={(
                      <Image
                        src={data.image.url}
                        alt={data.image.alt}
                        width={1600}
                        height={900}
                      />
                        )}
                  />
                </StyledLink>
              </Link>
            </Flex>
          ))}
        </Grid>
      )}
  </>
);

HorizontalNews.defaultProps = {
  horizontalScroll: false,
};

HorizontalNews.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape).isRequired,
  horizontalScroll: PropTypes.bool,
};

const News = ({
  posts: initialPosts,
  category,
  allowPagination,
  horizontalScroll,
  tag,
}) => {
  const [loading, setLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(allowPagination);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (page !== 1) {
      setLoading(true);

      const fetchData = async () => {
        let getPages;

        if (category) {
          getPages = getBlogCategory(category, { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE, page });
        } else if (tag) {
          getPages = getBlogTags([tag], { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE, page });
        } else {
          getPages = getDocs('post', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE, page });
        }

        const newPages = await getPages;
        if (newPages.length === 0) {
          setShowLoadMore(false);
        }

        setPosts((oldPages) => [...oldPages, ...newPages]);
        setLoading(false);
      };

      fetchData();
    }
  }, [category, page, tag]);

  useEffect(() => {
    if (posts.length % PAGE_SIZE !== 0) {
      setShowLoadMore(false);
    }
  }, [posts]);

  return (
    <Box
      bg="greyLight"
      py={{ _: 6, l: 10 }}
      px={{ _: 0, m: 'gutter.m' }}
    >
      <Container>
        <Heading as="h2" fontSize={[3, 3, 4]} mt={0} px={{ _: 'gutter.s', m: '0' }} isBody color="primary">{category || tag || 'Latest'} News</Heading>
        <HorizontalNews horizontalScroll={horizontalScroll} posts={posts} />

        {loading && <Flex alignItems="center" justifyContent="center" py={5}>Loading...</Flex>}
        {showLoadMore && !loading && (
          <LoadMore setPage={setPage} />
        )}
      </Container>
    </Box>
  );
};
News.defaultProps = {
  horizontalScroll: true,
  allowPagination: false,
  category: null,
  tag: null,
  posts: [],
};

News.propTypes = {
  horizontalScroll: PropTypes.bool,
  allowPagination: PropTypes.bool,
  category: PropTypes.string,
  tag: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default News;
