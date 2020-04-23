import React from 'react';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from './prismic-wrapper';
import { Grid, Flex } from './layout';
import Card from './card';
import Image from './image';
import Heading from './heading';
import Content from './content';

const CardsSlice = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
    items: get(rawData, 'items'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2} textAlign="center">
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content textAlign="center" pb={3}>{RichText.render(data.content)}</Content>}

      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gridGap={{ _: 'gutter._', m: 'gutter.m' }}
      >
        {data.items.map((itemData) => {
          const item = {
            title: get(itemData, 'title'),
            content: get(itemData, 'content'),
            image: get(itemData, 'image'),
          };

          return (
            <Flex flexDirection="column" key={item.title}>
              <Card
                variant="light"
                name={item.title}
                content={item.content}
                image={(
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    width={1600}
                    height={900}
                  />
              )}
              />
            </Flex>
          );
        })}
      </Grid>
    </PrismicWrapper>
  );
};

export default CardsSlice;
