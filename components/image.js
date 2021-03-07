/* eslint-disable jsx-a11y/alt-text */
import { useRef } from 'react';
import styled from '@emotion/styled';
import { space, layout, border } from 'styled-system';
import { useInView } from 'react-intersection-observer';

const calcAspectRatio = (height, width) => (height / width) * 100 || null;

export const Container = styled.div`
  position: relative;
  width: 100%;
  ${space}
  ${layout}
  padding-bottom: ${({ aspectRatio }) => aspectRatio}%;
`;

const ImageWrapper = styled.div`
  width: 100%;
`;

const Image = styled.img`
  vertical-align: bottom;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;

  opacity: 1;
  transition: 0.3s opacity;

  &[data-src] {
    opacity: 0;
  }

  ${border};
`;

const ResponsiveImage = ({ src, alt, width, height, borderRadius = '8px' }) => {
  const imageProps = {
    alt,
    width,
    height,
    borderRadius,
  };

  const [ref, inView] = useInView({
    rootMargin: '200px 0px',
    threshold: 0,
    triggerOnce: true,
  });

  const imageRef = useRef();

  const handleOnLoad = () => {
    imageRef.current.removeAttribute('data-src');
  };

  return (
    <Container aspectRatio={calcAspectRatio(height, width)}>
      <ImageWrapper ref={ref}>
        {inView ? (
          <Image
            src={src}
            ref={imageRef}
            data-src={src}
            {...imageProps}
            onLoad={handleOnLoad}
          />
        ) : null}
      </ImageWrapper>
    </Container>
  );
};

export default ResponsiveImage;
