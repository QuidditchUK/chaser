import get from 'just-safe-get';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

const Hero = (rawData) => {
  const title = get(rawData, 'primary.slug');
  const image = get(rawData, 'primary.image.url');

  return (
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${image})`}
      backgroundColor="qukBlue"
      backgroundSize="cover"
      backgroundPosition="center"
      px={{ base: 4, sm: 8, md: 9 }}
      minHeight={HERO_MIN_HEIGHTS}
    >
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
