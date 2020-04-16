import React from 'react';
import { Box } from './layout';
import Container from './container';

const year = new Date().getFullYear();

export const Footer = () => (
  <Box
    bg="primary"
    color="white"
    py={{ _: 4, l: 5 }}
    px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
  >
    <Container textAlign="center">
      <span>All Rights Reserved © {year} QuidditchUK</span>
    </Container>
  </Box>
);

export default Footer;
