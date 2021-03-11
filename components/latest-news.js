import { forwardRef } from 'react';
import Link from 'next/link';

import {
  Flex,
  Box,
  Heading,
  Link as ChakraLink,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import Card from 'components/card';
import Image from 'components/image';
import Container from 'components/container';
import HorizontalScrollWrapper from 'components/horizontal-scroll-wrapper';

export const StyledLink = forwardRef(function StyledLink(props, ref) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scale = prefersReducedMotion ? '1.0' : '1.1';

  return (
    <ChakraLink
      ref={ref}
      textDecoration="none"
      display="flex"
      flexDirection="column"
      flexGrow="1"
      _hover={{
        textDecoration: 'none',
        img: {
          scale,
        },
      }}
      sx={{
        img: {
          transition: 'scale 1s',
        },
      }}
      {...props}
    />
  );
});

const News = ({ posts = [], category, horizontalScroll = true, tag }) => {
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
          itemsCount={posts?.length}
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
      </Container>
    </Box>
  );
};

export default News;
