import React from 'react';
import PropTypes from 'prop-types';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';

import Heading from 'components/heading';
import PrismicWrapper from 'components/prismic-wrapper';
import { Grid } from 'components/layout';
import Content from 'components/content';
import { Embed } from 'components/embed-slice';
import { CenterJustify } from 'components/image-and-content';
import { Support } from 'components/image-slice';

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
      {item.support && (<Support textAlign="center" pt={2} fontStyle="italic">{RichText.render(item.support)}</Support>)}
    </CenterJustify>
  </Grid>
);

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.array,
    content: PropTypes.array,
    embed: PropTypes.shape({}),
    support: PropTypes.array,
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
          support: get(itemData, 'support'),
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
