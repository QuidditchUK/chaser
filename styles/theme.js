import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { ButtonStyles } from 'components/button';
import { PrismicStyles } from 'components/prismic-wrapper';
import { CardStyles } from 'components/card';

const emBase = 16;
export const rem = (value) => `${value / emBase}rem`;

export default extendTheme({
  components: {
    Button: ButtonStyles,
    Prismic: PrismicStyles,
    Card: CardStyles,
  },

  colors: {
    qukBlue: '#0e375f',
    monarchRed: '#b61c2a',
    greyMedium: '#d6d7dc',
    northernMagenta: '#90268c',
    southernBlue: '#84c7e6',
    greyLight: '#e6ebef',
    greyDark: '#787d80',
    darkBlue: '#070d1f',
    darkRed: '#1f0707',
    keeperGreen: '#34a31d',
    seekerYellow: '#f7ea34',
    tornadoOrange: '#c95100',
  },

  breakpoints: createBreakpoints({
    sm: rem(576),
    md: rem(768),
    lg: rem(992),
    xl: rem(1200),
  }),

  fonts: {
    heading: `century-gothic, sans-serif`,
    body: `adelle-sans, sans-serif`,
  },

  lineHeights: {
    body: rem(16),
    display: rem(20),
    displayMobile: rem(24),
  },

  shadows: {
    sm: `0 0 ${rem(6.5)} rgba(0, 0, 0, 0.5)`,
    md: `0 0 ${rem(10)} rgba(0, 0, 0, 0.3)`,
    lg: `0 0 ${rem(50)} rgba(0, 0, 0, 0.3)`,
  },

  styles: {
    global: {
      'html, body': {
        lineHeight: 1.15,
      },
    },
  },
});
