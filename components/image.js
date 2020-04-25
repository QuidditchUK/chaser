/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { space, layout } from 'styled-system';

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
  }
`;

const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
}) => {
  const imageProps = {
    src, alt, width, height,
  };

  return (
    <Container aspectRatio={calcAspectRatio(height, width)}>
      <Image>
        <img {...imageProps} />
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
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default ResponsiveImage;
