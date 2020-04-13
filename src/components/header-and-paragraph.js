import React from 'react';
import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
import styled from 'styled-components';
import Container from './container';
import Heading from './heading';
import PrismicWrapper from './prismic-wrapper';
import { rem } from '../styles/theme';

const TextContainer = styled(Container)`
  max-width: ${rem(960)};
`;

const HeaderAndParagraph = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    content: get(rawData, 'primary.content'),
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      <TextContainer>
        {data.title && (
        <Heading as="h2" fontSize={[3, 3, 4]}>
          {RichText.asText(data.title)}
        </Heading>
        )}

        {data.content && <>{RichText.render(data.content)}</>}
      </TextContainer>
    </PrismicWrapper>
  );
};

export default HeaderAndParagraph;
