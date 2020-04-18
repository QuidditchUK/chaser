import React from 'react';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import Heading from './heading';
import Content from './content';
import PrismicWrapper from './prismic-wrapper';

const HeaderAndParagraph = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant} small>
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <Content>{RichText.render(data.content)}</Content>}
    </PrismicWrapper>
  );
};

export default HeaderAndParagraph;
