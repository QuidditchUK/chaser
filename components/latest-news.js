import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

import { Grid, Flex, Box } from './layout';
import Card from './card';
import Image from './image';
import Container from './container';
import Heading from './heading';

const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const News = ({ posts }) => (
  <Box
    bg="greyLight"
    py={{ _: 4, l: 10 }}
    px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
  >
    <Container>
      <Heading as="h2" fontSize={[3, 3, 4]} mt={0}>Latest News</Heading>

      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gridGap={{ _: 'gutter._', m: 'gutter.m' }}
      >

        {posts.map(({ uid, data }) => (
          <Flex flexDirection="column" key={uid}>
            <Link href={`/news/${uid}`} passHref>
              <StyledLink>
                <Card
                  variant="light"
                  name={data.title}
                  category={data.category}
                  image={(
                    <Image
                      src={data.image.url}
                      alt={data.image.alt}
                      width={1600}
                      height={900}
                    />
                  )}
                />
              </StyledLink>
            </Link>
          </Flex>
        ))}
      </Grid>
    </Container>
  </Box>
);

News.defaultProps = {
  posts: [],
};

News.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default News;
