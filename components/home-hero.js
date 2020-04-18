import React from 'react';
import get from 'just-safe-get';
import styled from 'styled-components';
import Input from './input';
import Button from './button';
import { HeadingHero } from './hero';
import { Flex, Box } from './layout';

const heightBreakpoints = { _: '30vh', l: '70vh' };

const Video = styled.video`
  width: 121%;
  min-height: 100%;
`;

const HomeHero = (rawData) => {
  const data = {
    title: get(rawData, 'primary.slug'),
    cta_text: get(rawData, 'primary.cta_text'),
    cta_url: get(rawData, 'primary.cta_url'),
    video: get(rawData, 'primary.video_url.url'),
    poster: get(rawData, 'primary.poster.url'),
  };

  return (
    <Box
      as="section"
      backgroundColor="primary"
      minHeight={heightBreakpoints}
      overflow="hidden"
      position="relative"
    >
      <Box
        minHeight={heightBreakpoints}
        position="absolute"
        zIndex={1}
      >
        <Video src={data.video} poster={data.poster} preload="metadata" autoPlay loop muted />
      </Box>

      <Flex
        position="relative"
        minHeight={heightBreakpoints}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        zIndex={2}
      >
        <HeadingHero fontSize={[4, 4, 5]} mt={0} mb={8} color="white">{data.title}</HeadingHero>

        <Flex flexDirection="row">
          <Input type="text" placeholder="Postcode" /><Button type="button" variant="primary" ml={2}>{data.cta_text}</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HomeHero;
