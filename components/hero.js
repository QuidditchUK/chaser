import React from 'react';
import get from 'just-safe-get';
import styled from 'styled-components';
import { Box, Flex } from 'components/layout';
import Heading from 'components/heading';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

export const HeadingHero = styled(Heading)`
  text-shadow: ${({ theme }) => theme.shadows.heading};
`;

const Hero = (rawData) => {
  const data = {
    title: get(rawData, 'primary.slug'),
    image: get(rawData, 'primary.image.url'),
  };

  return (
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${data.image})`}
      backgroundColor="primary"
      backgroundSize="cover"
      backgroundPosition="center"
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      minHeight={HERO_MIN_HEIGHTS}
    >
      <Flex
        position="relative"
        minHeight={HERO_MIN_HEIGHTS}
        alignItems="center"
        justifyContent="center"
      >
        <HeadingHero fontSize={[4, 4, 7]} color="white">{data.title}</HeadingHero>
      </Flex>
    </Box>
  );
};
export default Hero;
