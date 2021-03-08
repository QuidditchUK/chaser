import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';

import PrismicWrapper, { buttonVariants } from 'components/prismic-wrapper';
import { Grid, Flex, Heading } from 'components';
import Content from 'components/content';
import { Embed } from 'components/embed-slice';
import { CenterJustify } from 'components/image-and-content';
import { Support } from 'components/image-slice';
import ExternalLink from 'components/external-link';
import Button from 'components/button';
import { linkResolver } from 'modules/prismic';

const Item = ({ item, isEmbedLeft }) => (
  <Grid
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={{ base: 4, md: 9 }}
  >
    <CenterJustify order={{ base: 2, md: `${isEmbedLeft ? 2 : 1}` }}>
      {RichText.asText(item.title) && (
        <Heading as="h2" fontSize="xl" mt={2}>
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
    </CenterJustify>

    <CenterJustify order={{ base: 1, md: `${isEmbedLeft ? 1 : 2}` }}>
      <Embed embed={item.embed} />
      {RichText.asText(item.support) && (
        <Support textAlign="center" pt={2} fontStyle="italic">
          {RichText.render(item.support)}
        </Support>
      )}
    </CenterJustify>
  </Grid>
);

const EmbedAndContent = (rawData) => {
  const items = get(rawData, 'items');

  return (
    <>
      {items.map((itemData, i) => {
        const item = {
          title: get(itemData, 'title'),
          content: get(itemData, 'content'),
          embed: get(itemData, 'embed'),
          variant: get(itemData, 'variant'),
          layout: get(itemData, 'layout_content'),
          support: get(itemData, 'support'),
          cta_text: get(itemData, 'cta_text'),
          cta_url: get(itemData, 'cta_url'),
        };

        const isEmbedLeft = item.layout === 'embed-left';

        return (
          <PrismicWrapper variant={item.variant} key={`embed-and-content-${i}`}>
            <Item item={item} isEmbedLeft={isEmbedLeft} />
          </PrismicWrapper>
        );
      })}
    </>
  );
};

export default EmbedAndContent;
