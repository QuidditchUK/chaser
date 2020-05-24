import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import styled from 'styled-components';

import Heading from 'components/heading';
import PrismicWrapper from 'components/prismic-wrapper';
import { Box, Grid } from 'components/layout';
import Image from 'components/image';
import { Support } from 'components/image-slice';
import Content from 'components/content';

export const CenterJustify = styled(Box)`
  display: flex;  
  flex-direction: column;
  justify-content: center;
`;

const Item = ({ item, isImageLeft }) => (
  <Grid
    gridTemplateColumns={{ _: '1fr', m: '1fr 1fr' }}
    gridGap={{ _: 'gutter._', m: 'gutter.m' }}
  >
    <CenterJustify order={{ _: 2, m: `${(isImageLeft ? 2 : 1)}` }}>
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(item.title)}
        </Heading>
      )}

      {item.content && <Content>{RichText.render(item.content)}</Content>}
    </CenterJustify>

    <CenterJustify order={{ _: 1, m: `${(isImageLeft ? 1 : 2)}` }}>
      <Image alt={item.image.alt} src={item.image.url} height={item.image.dimensions.height} width={item.image.dimensions.width} />
      {item.support && (<Support textAlign="center" pt={2} fontStyle="italic">{item.support}</Support>)}
    </CenterJustify>
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
    support: PropTypes.array,
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
          support: get(itemData, 'support'),
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
