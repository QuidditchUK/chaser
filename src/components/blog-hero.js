import React from 'react';
import styled from 'styled-components';
import { typography } from 'styled-system';

import get from 'just-safe-get';

import { HeadingHero } from './hero';
import { Box, Flex } from './layout';
import Container from './container';

import { rem } from '../styles/theme';

const minHeight = { _: '30vh', m: '50vh' };

const Tag = styled.span`
  ${typography};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  border: 3px solid ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius[1]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
`;

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
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={minHeight}
      >

        <Flex
          position="absolute"
          minHeight={minHeight}
          zIndex={1}
          bg="primary"
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={minHeight}
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          <Container maxWidth={rem(960)} textAlign="center">
            <HeadingHero fontSize={[3, 3, 4]} color="white" textAlign="center" pb={2}>{data.title}</HeadingHero>
            <Tag fontWeight="bold" fontSize={[1, 1, 2]}>{data.category}</Tag>
          </Container>
        </Flex>
      </Box>
    </>
  );
};
export default BlogHero;
