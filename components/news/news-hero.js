import dynamic from 'next/dynamic';
import Link from 'next/link';
import format from 'date-fns/format';
import Image from 'next/image';

import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';
import { Box, Flex, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import CATEGORIES from 'constants/categories';
import { rem } from 'styles/theme';

const Container = dynamic(() => import('components/layout/container'));

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

const NewsHero = ({ title, image, category, date }) => {
  return (
    <>
      <Box
        as="section"
        position="relative"
        backgroundColor="qukBlue"
        minHeight={HERO_MIN_HEIGHTS}
      >
        <Image
          src={image.url}
          alt={image.alt}
          layout="fill"
          objectPosition="center center"
          objectFit="cover"
          priority={true}
        />
        <Flex
          position="absolute"
          bgGradient={`linear(to-t, ${CATEGORIES[category]}, rgba(0, 0, 0, 0))`}
          width="100%"
          height="50%"
          bottom="0"
        />

        <Flex
          position="relative"
          minHeight={HERO_MIN_HEIGHTS}
          alignItems="center"
          justifyContent="center"
          px={{ base: 4, sm: 8, md: 9 }}
          flexDirection="column"
          color="white"
        >
          <Container maxWidth={rem(960)} textAlign="center">
            <Text
              fontSize={{ base: 'sm', md: 'lg' }}
              fontWeight="bold"
              textShadow="0 0 5px rgb(0,0,0)"
              mb={2}
              mt={0}
            >
              {format(new Date(date), 'MMMM d, yyyy')}
            </Text>

            <Heading
              mt={0}
              fontSize={{ base: '2xl', md: '5xl' }}
              color="white"
              textAlign="center"
              pb={2}
              textShadow="0 0 10px rgb(0,0,0)"
              mb={2}
            >
              {title}
            </Heading>
            <Link href={`/news/${category?.toLowerCase()}`} passHref>
              <ChakraLink
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                href={`/news/${category?.toLowerCase()}`}
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
export default NewsHero;
