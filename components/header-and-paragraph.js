import React from 'react';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import { Flex } from 'components/layout';
import Heading from 'components/heading';
import Content from 'components/content';
import Button from 'components/button';
import PrismicWrapper, { buttonVariants } from 'components/prismic-wrapper';
import ExternalLink from 'components/external-link';
import { linkResolver } from 'modules/prismic';

const HeaderAndParagraph = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
    cta_text: get(rawData, 'primary.cta_text'),
    cta_url: get(rawData, 'primary.cta_url'),
  };

  return (
    <PrismicWrapper variant={data.variant} small>
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content>{RichText.render(data.content, linkResolver)}</Content>}

      {data.cta_text && (
        <Flex justifyContent="center">
          <ExternalLink href={data.cta_url}>
            <Button type="button" variant={buttonVariants[data.variant]} ml={2}>
              {data.cta_text}
            </Button>
          </ExternalLink>
        </Flex>
      )}
    </PrismicWrapper>
  );
};

export default HeaderAndParagraph;
