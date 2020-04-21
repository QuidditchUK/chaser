import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import Heading from './heading';
import PrismicWrapper from './prismic-wrapper';
import { Box, Grid } from './layout';
import Image from './image';
import Content from './content';

const Item = ({ item, isImageLeft }) => (
  <Grid
    gridTemplateColumns={{ _: '1fr', m: '1fr 1fr' }}
    gridGap={{ _: 'gutter._', m: 'gutter.m' }}
  >
    <Box order={{ _: 2, m: `${(isImageLeft ? 2 : 1)}` }}>
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(item.title)}
        </Heading>
      )}

      {item.content && <Content>{RichText.render(item.content)}</Content>}
    </Box>

    <Box order={{ _: 1, m: `${(isImageLeft ? 1 : 2)}` }}>
      <Image alt={item.image.alt} src={item.image.url} height={item.image.dimensions.height} width={item.image.dimensions.width} />
    </Box>
  </Grid>
);

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.array,
    content: PropTypes.array,
    image: PropTypes.shape({
      alt: PropTypes.string,
      url: PropTypes.string,
      dimensions: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
      }),
    }),
  }).isRequired,
  isImageLeft: PropTypes.bool.isRequired,
};

const ImageAndContent = (rawData) => {
  const data = {
    items: get(rawData, 'items'),
  };

  return (
    <>
      {data.items.map((itemData, i) => {
        const item = {
          title: get(itemData, 'title'),
          content: get(itemData, 'content'),
          image: get(itemData, 'image'),
          variant: get(itemData, 'variant'),
          layout: get(itemData, 'layout_content'),
        };

        const isImageLeft = item.layout === 'image-left';

        return (
          <PrismicWrapper variant={item.variant} key={`image-and-content-${i}`}>
            <Item
              item={item}
              isImageLeft={isImageLeft}
            />
          </PrismicWrapper>
        );
      })}
    </>
  );
};

export default ImageAndContent;
