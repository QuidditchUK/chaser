import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';

import PrismicWrapper, { buttonVariants } from 'components/prismic-wrapper';
import { Grid, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'components/image';

import Content from 'components/content';
import ExternalLink from 'components/external-link';
import Button from 'components/button';
import { linkResolver } from 'modules/prismic';

const Item = ({ item, isImageLeft }) => (
  <Grid
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={{ base: 4, md: 9 }}
  >
    <Flex
      direction="column"
      justifyContent="center"
      order={{ base: 2, md: `${isImageLeft ? 2 : 1}` }}
    >
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize={{ base: 'xl', md: '3xl' }} mt={2}>
          {RichText.asText(item.title)}
        </Heading>
      )}

      {item.content && (
        <Content>{RichText.render(item.content, linkResolver)}</Content>
      )}

      {item.cta_text && (
        <Flex justifyContent="center">
          <ExternalLink href={item.cta_url}>
            <Button type="button" variant={buttonVariants[item.variant]} ml={2}>
              {item.cta_text}
            </Button>
          </ExternalLink>
        </Flex>
      )}
    </Flex>

    <Flex
      direction="column"
      justifyContent="center"
      order={{ base: 1, md: `${isImageLeft ? 1 : 2}` }}
    >
      <Image
        alt={item?.image?.alt}
        src={item?.image?.url}
        height={item.image?.dimensions?.height}
        width={item.image?.dimensions?.width}
      />
      {RichText.asText(item.support) && (
        <Text textAlign="center" pt={2} fontStyle="italic">
          {RichText.render(item.support, linkResolver)}
        </Text>
      )}
    </Flex>
  </Grid>
);

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
          cta_text: get(itemData, 'cta_text'),
          cta_url: get(itemData, 'cta_url'),
        };

        const isImageLeft = item.layout === 'image-left';

        return (
          <PrismicWrapper variant={item.variant} key={`image-and-content-${i}`}>
            <Item item={item} isImageLeft={isImageLeft} />
          </PrismicWrapper>
        );
      })}
    </>
  );
};

export default ImageAndContent;
