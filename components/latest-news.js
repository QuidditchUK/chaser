import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { getDocs } from '../modules/prismic';
import { Grid, Flex, Box } from './layout';
import Card from './card';
import Image from './image';
import Container from './container';

const StyledLink = styled.a`
  text-decoration:none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const News = ({ count }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: 18 });
      setNews(data);
    };

    fetchData();
  }, [count]);

  return (
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container>
        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gridGap={{ _: 'gutter._', m: 'gutter.m' }}
        >

          {news.map(({ uid, data }) => (
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
};

News.defaultProps = {
  count: null,
};

News.propTypes = {
  count: PropTypes.number,
};

export default News;
