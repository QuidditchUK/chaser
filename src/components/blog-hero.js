import React from 'react';
import styled from 'styled-components';
import { typography } from 'styled-system';
import { format } from 'date-fns';
import get from 'just-safe-get';
import { HeadingHero } from './hero';
import { Box, Flex } from './layout';
import Container from './container';
import { rem } from '../styles/theme';

const minHeight = { _: '30vh', m: '50vh' };

const SupportText = styled.p`
  ${typography};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  text-shadow: ${({ theme }) => theme.shadows.body};
  text-transform: uppercase;
`;

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
    date: get(rawData, 'date'),
    category: get(rawData, 'category'),
    author: get(rawData, 'author'),
  };

  return (
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
          <Tag fontWeight="bold" fontSize={[1, 1, 2]}>{data.category}</Tag>
          <HeadingHero fontSize={[3, 3, 4]} color="white" textAlign="center">{data.title}</HeadingHero>
          <SupportText fontSize={[1, 1, 2]} fontWeight="bold">By {data.author} | {format(new Date(data.date), 'MMMM d, yyyy')}</SupportText>
        </Container>
      </Flex>
    </Box>
  );
};
export default BlogHero;
