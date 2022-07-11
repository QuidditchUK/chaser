import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { ButtonStyles } from 'components/shared/button';
import { SliceStyles } from 'components/shared/slice';
import { CardStyles } from 'components/shared/card';
import { HorizontalCardStyles } from 'components/shared/horizontal-card';
import { InputV2Styles } from 'components/formControls/inputV2';

const emBase = 16;
export const rem = (value) => `${value / emBase}rem`;

export default extendTheme({
  components: {
    Button: ButtonStyles,
    Slice: SliceStyles,
    Card: CardStyles,
    HorizontalCard: HorizontalCardStyles,
    InputV2: InputV2Styles,
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
    '2xl': rem(1500),
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
        height: '100%',
        width: '100%',
        lineHeight: 1.15,
      },
    },
  },
});
