import Image from 'next/image';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

const Hero = ({ primary }) => {
  const { slug, image } = primary;

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
        src={image?.url}
        alt={image?.alt}
        layout="fill"
        objectPosition="center center"
        objectFit="cover"
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
          textShadow="0 0 10px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)"
        >
          {slug}
        </Heading>
      </Flex>
    </Box>
  );
};
export default Hero;
