import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

import { Grid, Flex, Box } from './layout';
import Card from './card';
import Image from './image';
import Button from './button';
import Container from './container';
import Heading from './heading';
import { getDocs, getBlogCategory, PAGE_SIZE } from '../modules/prismic';

const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const HorizontalScrollWrapper = styled.div`
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

const HorizontalSpacer = styled.div`
  display: block;

   @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    display: none;
  }
`;

const News = ({
  posts: initialPosts, category, allowPagination, horizontalScroll,
}) => {
  const [loading, setLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(allowPagination);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    if (page !== 1) {
      setLoading(true);

      const fetchData = async () => {
        const getPages = category
          ? getBlogCategory(category, { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE, page })
          : getDocs('post', { orderings: '[my.post.date desc]', pageSize: PAGE_SIZE, page });

        const newPages = await getPages;

        setPosts((oldPages) => [...oldPages, ...newPages]);
        setLoading(false);
      };

      fetchData();
    }
  }, [category, page]);

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
        <Heading as="h2" fontSize={[3, 3, 4]} mt={0} px={{ _: 'gutter.s', m: '0' }} isBody color="primary">{category || 'Latest'} News</Heading>
        {horizontalScroll
          ? (
            <HorizontalScrollWrapper>
              <Grid
                gridTemplateColumns={{ _: '1rem repeat(6, calc(75% - 40px)) 2.5rem', m: 'repeat(auto-fit, minmax(300px, 1fr))' }}
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

        {loading && <Flex alignItems="center" justifyContent="center" py={5}>Loading...</Flex>}
        {showLoadMore && !loading && (
          <Flex alignItems="center" justifyContent="center" py={5}>
            <Button variant="light" onClick={() => setPage((currentPage) => currentPage + 1)}>Load More</Button>
          </Flex>
        )}
      </Container>
    </Box>
  );
};
News.defaultProps = {
  horizontalScroll: true,
  allowPagination: false,
  category: null,
  posts: [],
};

News.propTypes = {
  horizontalScroll: PropTypes.bool,
  allowPagination: PropTypes.bool,
  category: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default News;
