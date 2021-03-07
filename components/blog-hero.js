import Link from 'next/link';
import get from 'just-safe-get';

import CATEGORIES from 'constants/categories';

import Container from 'components/container';
import { rem } from 'styles/theme';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { Box, Flex, Heading, Link as ChakraLink } from 'components';

const Tag = (props) => (
  <Box
    as="span"
    color="white"
    textTransform="uppercase"
    textDecoration="none"
    borderWidth="3px"
    borderStyle="solid"
    borderRadius="lg"
    py={2}
    px={4}
    fontWeight="bold"
    {...props}
  />
);

const BlogHero = (rawData) => {
  const data = {
    title: get(rawData, 'title'),
    image: get(rawData, 'image.url'),
    category: get(rawData, 'category'),
  };

  return (
    <>
      <Box
        as="section"
        position="relative"
        backgroundImage={`url(${data.image})`}
        backgroundColor="qukBlue"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          zIndex={1}
          bg="qukBlue"
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={BLOG_MIN_HEIGHTS}
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          <Container
            maxWidth={rem(960)}
            textAlign="center"
            px={{ base: 4, sm: 8, md: 9 }}
          >
            <Heading
              fontSize={{ base: 'xl', md: '3xl' }}
              color="white"
              textAlign="center"
              pb={2}
              textShadow="lg"
            >
              {data.title}
            </Heading>

            <Link href={`/news/${data.category.toLowerCase()}`} passHref>
              <ChakraLink
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                href={`/news/${data.category.toLowerCase()}`}
              >
                <Tag
                  fontSize="sm"
                  bg={CATEGORIES[data.category]}
                  borderColor={CATEGORIES[data.category]}
                >
                  {data.category}
                </Tag>
              </ChakraLink>
            </Link>
          </Container>
        </Flex>
      </Box>
    </>
  );
};
export default BlogHero;
