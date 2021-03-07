import { useRef } from 'react';
import { Box } from 'components';
import styled from '@emotion/styled';
import Flickity from 'react-flickity-component';
import Image from 'components/image';

const CarouselContainer = styled(Box)`
  position: relative;
  width: 100%;

  ${({ aspectRatio }) =>
    aspectRatio &&
    `
    height: 0;
    padding-bottom: ${aspectRatio}%;
    overflow: hidden;
  `};

  .flickity-prev-next-button {
    position: absolute;
    top: 40%;
    background: transparent;
    fill: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 0px;
  }

  .previous {
    left: 0;
    padding-left: 1rem;
  }

  .next {
    right: 0;
    padding-right: 1rem;
  }
`;

const Carousel = ({ images, height, width }) => {
  const aspectRatio = (height / width) * 100;
  const flickity = useRef();
  const hasImages = images && !!images.length;

  return (
    <CarouselContainer aspectRatio={aspectRatio}>
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
              borderRadius="0px"
            />
          ))}
      </Flickity>
    </CarouselContainer>
  );
};

export default Carousel;
