import React from 'react';
import get from 'just-safe-get';
import styled from 'styled-components';
import { Box, Flex } from './layout';
import Heading from './heading';

export const HeadingHero = styled(Heading)`
  text-shadow: ${({ theme }) => theme.shadows.heading};
`;

const minHeight = { _: '250px', m: '540px' };

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
      minHeight={minHeight}
    >
      <Flex
        position="relative"
        minHeight={minHeight}
        alignItems="center"
        justifyContent="center"
      >
        <HeadingHero fontSize={[4, 4, 5]} color="white">{data.title}</HeadingHero>
      </Flex>
    </Box>
  );
};
export default Hero;
