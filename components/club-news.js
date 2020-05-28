import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { Grid, Flex } from 'components/layout';
import Card from 'components/card';
import Image from 'components/image';
import { StyledLink } from 'components/latest-news';

export const ClubNews = ({ posts, bgColor, color }) => (
  <Grid
    gridTemplateColumns={{ _: '1fr', l: 'repeat(auto-fit, minmax(150px, 1fr))' }}
    gridGap={{ _: 'gutter._', m: 'gutter.m' }}
  >
    {posts.map(({ uid, data }) => (
      <Flex flexDirection="column" key={uid}>
        <Link href="/news/[id]" as={`/news/${uid}`} passHref>
          <StyledLink>
            <Card
              color={color}
              backgroundColor={bgColor}
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
);

ClubNews.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape).isRequired,
  bgColor: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default ClubNews;
