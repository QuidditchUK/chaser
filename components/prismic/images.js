import { Flex, Grid, Text } from '@chakra-ui/react';
import { PrismicImageWithDefaults } from '../shared/image';
import dynamic from 'next/dynamic';

const Slice = dynamic(() => import('components/shared/slice'));

const Item = ({ item }) => {
  return (
    <Flex direction="column">
      <Flex direction="column" flexGrow={1} position="relative">
        {item?.image?.url && (
          <PrismicImageWithDefaults
            field={item?.image}
            layout="responsive"
            objectFit="cover"
          />
        )}
      </Flex>
      {item.support && (
        <Text textAlign="center" pt={2} fontStyle="italic">
          {item.support}
        </Text>
      )}
    </Flex>
  );
};

const ImageSlice = ({ slice }) => {
  const { primary, items } = slice;

  return (
    <Slice variant={primary?.variant} size="md">
      <Grid
        gridTemplateColumns={{
          base: '1fr',
          md: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
        gridGap={{ base: 4, md: 9 }}
        gridAutoRows="1fr"
        height="100%"
        position="relative"
      >
        {items.map((item, i) => (
          <Item key={`image-slice-${i}`} item={item} />
        ))}
      </Grid>
    </Slice>
  );
};

export default ImageSlice;
