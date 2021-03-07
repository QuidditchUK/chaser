import get from 'just-safe-get';
import styled from '@emotion/styled';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { typography, space } from 'styled-system';
import PrismicWrapper from 'components/prismic-wrapper';
import { Box, Grid } from 'components';
import Image from 'components/image';

export const Support = styled.div`
  ${typography};
  ${space};
`;

const Item = ({ item }) => {
  const { height, width } = item.image?.dimensions;

  return (
    <Box>
      <Image
        alt={item.image?.alt}
        src={item.image?.url}
        height={height}
        width={width}
      />
      {item.support && (
        <Support textAlign="center" pt={2} fontStyle="italic">
          {item.support}
        </Support>
      )}
    </Box>
  );
};

const ImageSlice = (rawData) => {
  const data = {
    items: get(rawData, 'items'),
    variant: get(rawData, 'primary.variant'),
  };

  const multipleImages = data.items.length > 1;

  return (
    <PrismicWrapper variant={data.variant} small>
      <SimpleReactLightbox>
        <SRLWrapper options={{ settings: { lightboxTransitionSpeed: 0.3 } }}>
          <Grid
            gridTemplateColumns={{
              base: '1fr',
              md: `${multipleImages ? '1fr 1fr' : '1fr'}`,
            }}
            gridGap={{ base: 4, md: 9 }}
          >
            {data.items.map((itemData, i) => {
              const item = {
                image: get(itemData, 'image'),
                support: get(itemData, 'support'),
              };

              return <Item key={`image-slice-${i}`} item={item} />;
            })}
          </Grid>
        </SRLWrapper>
      </SimpleReactLightbox>
    </PrismicWrapper>
  );
};

export default ImageSlice;
