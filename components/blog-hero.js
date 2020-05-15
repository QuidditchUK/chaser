import React from 'react';
import styled from 'styled-components';
import { typography, color, border } from 'styled-system';
import Link from 'next/link';

import get from 'just-safe-get';

import CATEGORIES from 'constants/categories';
import { HeadingHero } from './hero';
import { Box, Flex } from './layout';
import Container from './container';

import { rem } from '../styles/theme';

const minHeight = { _: '250px', m: '400px' };

const Tag = styled.span`
  ${typography};
  ${color};
  ${border}
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  text-decoration: none;
  border-width: 3px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.radius[1]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
`;

const StyledLink = styled.a`
  text-decoration: none;
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
          <Container maxWidth={rem(960)} textAlign="center" px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
            <HeadingHero fontSize={[3, 3, 4]} color="white" textAlign="center" pb={2}>{data.title}</HeadingHero>

            <Link href={`/news/${data.category.toLowerCase()}`} passHref>
              <StyledLink href={`/news/${data.category.toLowerCase()}`}>
                <Tag fontWeight="bold" fontSize={[1, 1, 2]} bg={CATEGORIES[data.category]} borderColor={CATEGORIES[data.category]}>
                  {data.category}
                </Tag>
              </StyledLink>
            </Link>
          </Container>
        </Flex>
      </Box>
    </>
  );
};
export default BlogHero;
