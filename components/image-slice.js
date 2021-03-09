import get from 'just-safe-get';
import PrismicWrapper from 'components/prismic-wrapper';
import {
  Box,
  Grid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
} from 'components';
import Image from 'components/carousel-image';

const Item = ({ item }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { height, width } = item.image?.dimensions;

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
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

      <Modal isOpen={isOpen} size="full" onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={{ base: 4, xl: 20 }} h="initial" bg="none">
          <Image
            alt={item.image?.alt}
            src={item.image?.url}
            height={height}
            width={width}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

const ImageSlice = (rawData) => {
  const items = get(rawData, 'items');
  const variant = get(rawData, 'primary.variant');

  const multipleImages = items.length > 1;

  return (
    <PrismicWrapper variant={variant} small>
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
    </PrismicWrapper>
  );
};

export default ImageSlice;
