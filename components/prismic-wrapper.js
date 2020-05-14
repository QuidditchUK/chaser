import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { variant as styledVariant } from 'styled-system';
import { Box } from './layout';
import Container from './container';
import { rem } from '../styles/theme';

const variants = {
  light: {
    color: 'darkBlue',
    bg: 'greyLight',
    a: {
      color: 'secondary',
    },
  },
  primary: {
    color: 'white',
    bg: 'primary',
    a: {
      color: 'secondary',
    },
  },
  secondary: {
    color: 'white',
    bg: 'secondary',
    a: {
      color: 'darkBlue',
    },
  },
  white: {
    color: 'darkBlue',
    bg: 'white',
    a: {
      color: 'secondary',
    },
  },
  dark: {
    color: 'white',
    bg: 'darkBlue',
    a: {
      color: 'secondary',
    },
  },
};

const Wrapper = styled(Box)(
  styledVariant({ variants }),
);

export const PrismicWrapper = ({ children, variant, small }) => (
  <Wrapper
    py={{ _: 4, l: 5 }}
    px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    as="section"
    variant={variant}
  >
    <Container maxWidth={small ? rem(960) : ''}>
      {children}
    </Container>
  </Wrapper>
);

PrismicWrapper.defaultProps = {
  variant: 'light',
  small: false,
};

PrismicWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  small: PropTypes.bool,
};

export default PrismicWrapper;
