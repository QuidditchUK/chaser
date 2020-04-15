import React from 'react';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import Heading from './heading';
import PrismicWrapper from './prismic-wrapper';

const HeaderAndParagraph = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      {RichText.asText(data.title) && (
        <Heading as="h2" fontSize={[3, 3, 4]} mt={2}>
          {RichText.asText(data.title)}
        </Heading>
      )}

      {data.content && <>{RichText.render(data.content)}</>}
    </PrismicWrapper>
  );
};

export default HeaderAndParagraph;
