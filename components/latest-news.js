import { forwardRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import {
  Flex,
  Box,
  Heading,
  Link as ChakraLink,
  Button,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const Image = dynamic(() => import('components/image'));
const Card = dynamic(() => import('components/card'));
const Container = dynamic(() => import('components/container'));
const HorizontalScrollWrapper = dynamic(() =>
  import('components/horizontal-scroll-wrapper')
);

export const StyledLink = forwardRef(function StyledLink(props, ref) {
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
          scale: '1.1',
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

const News = ({
  posts = [],
  category,
  horizontalScroll = true,
  showAllNewsButton = true,
  tag,
}) => {
  return (
    <Box bg="greyLight" py={{ base: 6, lg: 10 }} px={{ base: 0, md: 9 }}>
      <Container>
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mr={{ base: 6, md: 0 }}
          mt="-1.5rem"
        >
          <Heading
            as="h2"
            fontSize="2xl"
            px={{ base: 8, md: 0 }}
            color="qukBlue"
            fontFamily="body"
          >
            {category || tag || 'Latest'} News
          </Heading>

          {showAllNewsButton && (
            <Link href="/news" passHref>
              <ChakraLink mr={{ base: 0, md: 0 }}>
                <Button
                  variant="transparent"
                  borderColor="qukBlue"
                  color="qukBlue"
                  _hover={{ bg: 'gray.300' }}
                  rightIcon={<ArrowForwardIcon />}
                >
                  All News
                </Button>
              </ChakraLink>
            </Link>
          )}
        </Flex>

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
                        layout="responsive"
                        width={640}
                        height={360}
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
