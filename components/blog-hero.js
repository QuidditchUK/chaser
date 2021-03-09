import Link from 'next/link';
import Image from 'next/image';
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
  const title = get(rawData, 'title');
  const image = get(rawData, 'image');
  const category = get(rawData, 'category');

  return (
    <>
      <Box
        as="section"
        position="relative"
        backgroundColor="qukBlue"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Image
          src={image.url}
          alt={image.alt}
          layout="fill"
          objectPosition="center center"
          objectFit="cover"
        />
        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          bg="qukBlue"
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={BLOG_MIN_HEIGHTS}
          alignItems="center"
          justifyContent="center"
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
              {title}
            </Heading>

            <Link href={`/news/${category.toLowerCase()}`} passHref>
              <ChakraLink
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                href={`/news/${category.toLowerCase()}`}
              >
                <Tag
                  fontSize="sm"
                  bg={CATEGORIES[category]}
                  borderColor={CATEGORIES[category]}
                >
                  {category}
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
