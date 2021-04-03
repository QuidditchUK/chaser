import get from 'just-safe-get';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

const Image = dynamic(() => import('components/image'));

const Hero = (rawData) => {
  const title = get(rawData, 'primary.slug');
  const image = get(rawData, 'primary.image');

  return (
    <Box
      as="section"
      position="relative"
      backgroundColor="qukBlue"
      backgroundSize="cover"
      overflow="hidden"
      px={{ base: 4, sm: 8, md: 9 }}
      minHeight={HERO_MIN_HEIGHTS}
    >
      <Image
        src={image.url}
        alt={image.alt}
        layout="fill"
        objectPosition="center center"
        objectFit="cover"
        borderRadius={0}
        priority={true}
      />
      <Flex
        position="relative"
        minHeight={HERO_MIN_HEIGHTS}
        alignItems="center"
        justifyContent="center"
      >
        <Heading
          fontSize={{ base: '4xl', md: '7xl' }}
          color="white"
          textShadow="lg"
        >
          {title}
        </Heading>
      </Flex>
    </Box>
  );
};
export default Hero;
