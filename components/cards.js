import React from 'react';
import { RichText, Link } from 'prismic-reactjs';
import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';
import { Flex } from 'components/layout';
import Card from 'components/card';
import Image from 'components/image';
import Heading from 'components/heading';
import Content from 'components/content';
import HorizontalScrollWrapper from 'components/horizontal-scroll-wrapper';
import { linkResolver } from 'modules/prismic';
import { StyledLink } from 'components/latest-news';

const CardsSlice = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
    items: get(rawData, 'items'),
    horizontalScroll: get(rawData, 'primary.horizontalScroll'),
  };

  return (
    <PrismicWrapper
      variant={data.variant}
      px={data.horizontalScroll ? { _: 0, m: 'gutter.m' } : { _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2} textAlign="center" px={data.horizontalScroll ? { _: 'gutter._', s: 'gutter.s', m: 'gutter.m' } : { _: 0, m: 'gutter.m' }}>
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content textAlign="center" pb={3} px={data.horizontalScroll ? { _: 'gutter._', s: 'gutter.s', m: 'gutter.m' } : { _: 0, m: 'gutter.m' }}>{RichText.render(data.content, linkResolver)}</Content>}

      <HorizontalScrollWrapper horizontalScroll={data.horizontalScroll} itemsCount={data.items?.length}>
        {data.items.map((itemData, i) => {
          const item = {
            title: get(itemData, 'title'),
            content: get(itemData, 'content'),
            image: get(itemData, 'image'),
            link: get(itemData, 'link'),
          };

          return (
            <Flex flexDirection="column" key={`cards-${i}`}>
              {Link.url(item.link, linkResolver)
                ? (
                  <StyledLink href={Link.url(item.link, linkResolver)} target={item.link.target} aria-label={item.title}>
                    <Card
                      variant="light"
                      name={item.title}
                      content={item.content}
                      image={item.image.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.alt}
                          width={1600}
                          height={900}
                        />
                      ) : null}
                    />
                  </StyledLink>
                )
                : (
                  <Card
                    variant="light"
                    name={item.title}
                    content={item.content}
                    image={item.image.url ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        width={1600}
                        height={900}
                      />
                    ) : null}
                  />
                )}
            </Flex>
          );
        })}
      </HorizontalScrollWrapper>
    </PrismicWrapper>
  );
};

export default CardsSlice;
