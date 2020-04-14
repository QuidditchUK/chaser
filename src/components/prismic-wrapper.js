import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { variant as styledVariant } from 'styled-system';
import { Box } from './layout';
import Container from './container';
import { rem } from '../styles/theme';

const variants = {
  light: {
    color: 'primary',
    bg: 'greyLight',
  },
  primary: {
    color: 'white',
    bg: 'primary',
  },
  secondary: {
    color: 'white',
    bg: 'secondary',
  },
  white: {
    color: 'black',
    bg: 'white',
  },
  dark: {
    color: 'white',
    bg: 'black',
  },
};

const Wrapper = styled(Box)(
  styledVariant({ variants }),
);

export const PrismicWrapper = ({ children, variant }) => (
  <Wrapper
    py={{ _: 4, l: 10 }}
    px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    as="section"
    variant={variant}
  >
    <Container maxWidth={rem(960)}>
      {children}
    </Container>
  </Wrapper>
);

PrismicWrapper.defaultProps = {
  variant: 'light',
};

PrismicWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
};

export default PrismicWrapper;
