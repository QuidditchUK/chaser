import React from 'react';
import PropTypes from 'prop-types';
import get from 'just-safe-get';
import styled from 'styled-components';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { typography, space } from 'styled-system';
import PrismicWrapper from 'components/prismic-wrapper';
import { Box, Grid } from 'components/layout';
import Image from 'components/image';

export const Support = styled.div`
  ${typography};
  ${space};
`;

const Item = ({ item }) => {
  const { height, width } = item.image.dimensions;

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
};

const ImageSlice = (rawData) => {
  const data = {
    items: get(rawData, 'items'),
    variant: get(rawData, 'primary.variant'),
  };

  const multipleImages = data.items.length > 1;

  return (
    <PrismicWrapper variant={data.variant} small>
      <SimpleReactLightbox>
        <SRLWrapper options={{ settings: { lightboxTransitionSpeed: 0.3 } }}>
          <Grid
            gridTemplateColumns={{ _: '1fr', m: `${(multipleImages ? '1fr 1fr' : '1fr')}` }}
            gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          >
            {data.items.map((itemData, i) => {
              const item = {
                image: get(itemData, 'image'),
                support: get(itemData, 'support'),
              };

              return (<Item key={`image-slice-${i}`} item={item} />);
            })}
          </Grid>
        </SRLWrapper>
      </SimpleReactLightbox>
    </PrismicWrapper>
  );
};

export default ImageSlice;
