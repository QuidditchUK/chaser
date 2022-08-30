import dynamic from 'next/dynamic';

import { Flex, Box, Heading } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { NewsCard } from 'components/shared/card';

const Button = dynamic(() => import('components/shared/button'));
// const Card = dynamic(() => import('components/shared/card'));
const Container = dynamic(() => import('components/layout/container'));
const HorizontalScrollWrapper = dynamic(() =>
  import('components/shared/horizontal-scroll-wrapper')
);

const News = ({
  posts = [],
  category,
  horizontalScroll = true,
  showAllNewsButton = true,
  tag,
}) => {
  console.log(posts);
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
            <Button
              href="/news"
              variant="transparent"
              borderColor="qukBlue"
              color="qukBlue"
              _hover={{ bg: 'gray.300' }}
              rightIcon={<ArrowForwardIcon />}
            >
              All News
            </Button>
          )}
        </Flex>

        <HorizontalScrollWrapper
          itemsCount={posts?.length}
          horizontalScroll={horizontalScroll}
        >
          {posts.map(({ uid, data }) => (
            <Flex flexDirection="column" key={uid}>
              <NewsCard
                title={data.title}
                href={`/news/${uid}`}
                ariaLabel={data?.title}
                category={data.category}
                date={data?.date}
                image={{
                  src: data?.image?.url,
                  alt: data?.image?.alt,
                  height: data?.image?.height,
                  width: data?.image?.width,
                }}
              />
            </Flex>
          ))}
        </HorizontalScrollWrapper>
      </Container>
    </Box>
  );
};

export default News;
