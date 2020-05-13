import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import Heading from './heading';
import PrismicWrapper from './prismic-wrapper';
import { Grid } from './layout';
import Content from './content';
import { Embed } from './embed-slice';
import { CenterJustify } from './image-and-content';

const Item = ({ item, isEmbedLeft }) => (
  <Grid
    gridTemplateColumns={{ _: '1fr', m: '1fr 1fr' }}
    gridGap={{ _: 'gutter._', m: 'gutter.m' }}
  >
    <CenterJustify order={{ _: 2, m: `${(isEmbedLeft ? 2 : 1)}` }}>
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(item.title)}
        </Heading>
      )}

      {item.content && <Content>{RichText.render(item.content)}</Content>}
    </CenterJustify>

    <CenterJustify order={{ _: 1, m: `${(isEmbedLeft ? 1 : 2)}` }}>
      <Embed embed={item.embed} />
    </CenterJustify>
  </Grid>
);

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.array,
    content: PropTypes.array,
    embed: PropTypes.shape({}),
  }).isRequired,
  isEmbedLeft: PropTypes.bool.isRequired,
};

const EmbedAndContent = (rawData) => {
  const data = {
    items: get(rawData, 'items'),
  };

  return (
    <>
      {data.items.map((itemData, i) => {
        const item = {
          title: get(itemData, 'title'),
          content: get(itemData, 'content'),
          embed: get(itemData, 'embed'),
          variant: get(itemData, 'variant'),
          layout: get(itemData, 'layout_content'),
        };

        const isEmbedLeft = item.layout === 'embed-left';

        return (
          <PrismicWrapper variant={item.variant} key={`embed-and-content-${i}`}>
            <Item
              item={item}
              isEmbedLeft={isEmbedLeft}
            />
          </PrismicWrapper>
        );
      })}
    </>
  );
};

export default EmbedAndContent;
