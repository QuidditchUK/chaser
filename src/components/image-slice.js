import React from 'react';
import get from 'just-safe-get';
import styled from 'styled-components';
import { typography, space } from 'styled-system';
import PrismicWrapper from './prismic-wrapper';
import Image from './image';

const Support = styled.div`
${typography};
${space};
`;

const ImageSlice = (rawData) => {
  const data = {
    image: get(rawData, 'primary.image'),
    support: get(rawData, 'primary.support'),
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      <Image alt={data.image.alt} src={data.image.url} height={data.image.dimensions.height} width={data.image.dimensions.width} />
      {data.support && (<Support textAlign="center" pt={2} fontStyle="italic">{data.support}</Support>)}
    </PrismicWrapper>
  );
};

export default ImageSlice;
