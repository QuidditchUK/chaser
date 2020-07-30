/* eslint-disable jsx-a11y/alt-text */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, layout } from 'styled-system';
import { useInView } from 'react-intersection-observer';

const calcAspectRatio = (height, width) => (height / width) * 100 || null;

export const Container = styled.div`
  position: relative;
  width: 100%;
  ${space}
  ${layout}
  padding-bottom: ${({ aspectRatio }) => aspectRatio}%;
`;

const Image = styled.div`
  width: 100%;

  img {
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
  }
`;

const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
}) => {
  const imageProps = {
    alt, width, height,
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
      <Image ref={ref}>
        {inView ? (<img src={src} ref={imageRef} data-src={src} {...imageProps} onLoad={handleOnLoad} />) : null}
      </Image>
    </Container>
  );
};

ResponsiveImage.defaultProps = {
  alt: '',
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ResponsiveImage;
