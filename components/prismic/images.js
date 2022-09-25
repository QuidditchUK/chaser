import { Flex, Grid, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Slice = dynamic(() => import('components/shared/slice'));
const Image = dynamic(() => import('components/shared/image'));

const Item = ({ item }) => {
  return (
    <>
      <Flex direction="column" flexGrow={1} position="relative">
        {item?.image?.url && (
          <Image
            alt={item.image?.alt}
            src={item.image?.url}
            layout="fill"
            objectFit="cover"
          />
        )}
        {item.support && (
          <Text textAlign="center" pt={2} fontStyle="italic">
            {item.support}
          </Text>
        )}
      </Flex>
    </>
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
        gridAutoRows="300px"
        height="100%"
      >
        {items.map((item, i) => (
          <Item key={`image-slice-${i}`} item={item} />
        ))}
      </Grid>
    </Slice>
  );
};

export default ImageSlice;
