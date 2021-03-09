import get from 'just-safe-get';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import PrismicWrapper from 'components/prismic-wrapper';
import { Box, Grid, Text } from 'components';
import Image from 'components/carousel-image';

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
        <Text textAlign="center" pt={2} fontStyle="italic">
          {item.support}
        </Text>
      )}
    </Box>
  );
};

const ImageSlice = (rawData) => {
  const items = get(rawData, 'items');
  const variant = get(rawData, 'primary.variant');

  const multipleImages = items.length > 1;

  return (
    <PrismicWrapper variant={variant} small>
      <SimpleReactLightbox>
        <SRLWrapper options={{ settings: { lightboxTransitionSpeed: 0.3 } }}>
          <Grid
            gridTemplateColumns={{
              base: '1fr',
              md: `${multipleImages ? '1fr 1fr' : '1fr'}`,
            }}
            gridGap={{ base: 4, md: 9 }}
          >
            {items.map((itemData, i) => {
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
