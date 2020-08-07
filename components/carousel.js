import React, { useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Flickity from 'react-flickity-component';
import Image from 'components/image';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;

  ${({ aspectRatio }) => aspectRatio && `
    height: 0;
    padding-bottom: ${aspectRatio}%;
    overflow: hidden;
  `};

  .flickity-prev-next-button {
    position: absolute;
    top:40%;
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
        {hasImages && images.map((image, i) => (
          <Image
            key={`carousel-image-${image}-${i}`}
            src={image}
            width={width}
            height={height}
          />
        ))}
      </Flickity>
    </CarouselContainer>
  );
};

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default Carousel;
