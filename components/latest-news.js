import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import { Flex, Box, Heading, Link as ChakraLink } from '@chakra-ui/react';
import Card from 'components/card';
import Image from 'components/image';
import Button from 'components/button';
import Container from 'components/container';
import HorizontalScrollWrapper from 'components/horizontal-scroll-wrapper';
import {
  getDocs,
  getBlogCategory,
  getBlogTags,
  PAGE_SIZE,
} from 'modules/prismic';

export const StyledLink = forwardRef(function StyledLink(props, ref) {
  return (
    <ChakraLink
      ref={ref}
      textDecoration="none"
      display="flex"
      flexDirection="column"
      flexGrow="1"
      _hover={{ textDecoration: 'none' }}
      {...props}
    />
  );
});

const LoadMore = ({ setPage }) => {
  const [ref, inView] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [inView, setPage]);

  return (
    <Flex alignItems="center" justifyContent="center" py={5} ref={ref}>
      <Button variant="light">Load More</Button>
    </Flex>
  );
};

const News = ({
  posts: initialPosts = [],
  category,
  allowPagination = false,
  horizontalScroll = true,
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
          getPages = getBlogCategory(category, {
            orderings: '[my.post.date desc]',
            pageSize: PAGE_SIZE,
            page,
          });
        } else if (tag) {
          getPages = getBlogTags([tag], {
            orderings: '[my.post.date desc]',
            pageSize: PAGE_SIZE,
            page,
          });
        } else {
          getPages = getDocs('post', {
            orderings: '[my.post.date desc]',
            pageSize: PAGE_SIZE,
            page,
          });
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
    <Box bg="greyLight" py={{ base: 6, lg: 10 }} px={{ base: 0, md: 9 }}>
      <Container>
        <Heading
          as="h2"
          fontSize="3xl"
          mt={0}
          px={{ base: 8, md: 0 }}
          color="qukBlue"
          fontFamily="body"
        >
          {category || tag || 'Latest'} News
        </Heading>

        <HorizontalScrollWrapper
          itemsCount={posts.length}
          horizontalScroll={horizontalScroll}
        >
          {posts.map(({ uid, data }) => (
            <Flex flexDirection="column" key={uid}>
              <Link href="/news/[id]" as={`/news/${uid}`} passHref>
                <StyledLink aria-label={data.title}>
                  <Card
                    name={data.title}
                    category={data.category}
                    image={
                      <Image
                        src={data.image.url}
                        alt={data.image.alt}
                        width={1600}
                        height={900}
                        borderRadius="0px"
                      />
                    }
                  />
                </StyledLink>
              </Link>
            </Flex>
          ))}
        </HorizontalScrollWrapper>

        {loading && (
          <Flex
            alignItems="center"
            justifyContent="center"
            py={5}
            color="qukBlue"
          >
            Loading...
          </Flex>
        )}
        {showLoadMore && !loading && <LoadMore setPage={setPage} />}
      </Container>
    </Box>
  );
};

export default News;
