import { useRef } from 'react';
import Flickity from 'react-flickity-component';
import { Box } from '@chakra-ui/react';
import Image from 'components/carousel-image';

const CarouselContainer = (props) => (
  <Box
    position="relative"
    w="100%"
    h="0"
    overflow="hidden"
    {...props}
    sx={{
      '.flickity-prev-next-button': {
        position: 'absolute',
        top: '40%',
        background: 'transparent',
        fill: 'white',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '0',
      },

      '.previous': {
        left: '0',
        paddingLeft: '1rem',
      },

      '.next': {
        right: '0',
        paddingRight: '1rem',
      },
    }}
  />
);

const Carousel = ({ images, height, width }) => {
  const aspectRatio = (height / width) * 100;
  const flickity = useRef();
  const hasImages = images && !!images.length;

  return (
    <CarouselContainer pb={`${aspectRatio}%`}>
      <Flickity
        flickityRef={(ref) => {
          flickity.current = ref;
        }}
        options={{
          wrapAround: true,
          pageDots: false,
          prevNextButtons: images.length > 1,
        }}
      >
        {hasImages &&
          images.map(({ image }, i) => (
            <Image
              key={`carousel-image-${image.url}-${i}`}
              src={image.url}
              width={width}
              height={height}
              alt={image.alt}
            />
          ))}
      </Flickity>
    </CarouselContainer>
  );
};

export default Carousel;
