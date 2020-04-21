import React from 'react';
import PropTypes from 'prop-types';
import get from 'just-safe-get';
import styled from 'styled-components';
import { typography, space } from 'styled-system';
import PrismicWrapper from './prismic-wrapper';
import { Box, Grid } from './layout';
import Image from './image';

const Support = styled.div`
${typography};
${space};
`;

const Item = ({ item, forceAspectRatio }) => {
  const { height, width } = forceAspectRatio ? { height: 9, width: 16 } : item.image.dimensions;
  return (
    <Box>
      <Image alt={item.image.alt} src={item.image.url} height={height} width={width} />
      {item.support && (<Support textAlign="center" pt={2} fontStyle="italic">{item.support}</Support>) }
    </Box>
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    support: PropTypes.string,
    image: PropTypes.shape({
      alt: PropTypes.string,
      url: PropTypes.string,
      dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
      }),
    }),
  }).isRequired,
  forceAspectRatio: PropTypes.bool.isRequired,
};

const ImageSlice = (rawData) => {
  const data = {
    items: get(rawData, 'items'),
    variant: get(rawData, 'primary.variant'),
  };

  const multipleImages = data.items.length > 1;

  return (
    <PrismicWrapper variant={data.variant} small>
      <Grid
        gridTemplateColumns={{ _: '1fr', m: `${(multipleImages ? '1fr 1fr' : '1fr')}` }}
        gridGap={{ _: 'gutter._', m: 'gutter.m' }}
      >
        {data.items.map((itemData, i) => {
          const item = {
            image: get(itemData, 'image'),
            support: get(itemData, 'support'),
          };

          return (<Item key={`image-slice-${i}`} item={item} forceAspectRatio={multipleImages} />);
        })}
      </Grid>
    </PrismicWrapper>
  );
};

export default ImageSlice;
